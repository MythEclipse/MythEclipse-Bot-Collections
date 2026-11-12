import type { Client } from "discord.js";
import { loadConfig } from "./config";
import { createDb } from "./db";
import { attachBotHandlers } from "./discord/bot";
import { createDiscordClient } from "./discord/client";
import { registerGuildCommandsWithToken } from "./discord/registerCommands";
import { installProcessSafetyNet, safeListener } from "./discord/safeListener";
import { startBoostCleanup } from "./services/boostCleanupService";
import { migrateToEncryptedUserIds } from "./db/migrateEncryption";
import { DiscordRoleRepository } from "./services/discordRoleRepository";
import { DrizzleBoosterRoleStore } from "./services/drizzleBoosterRoleStore";
import { logger } from "./logger";

// Installed before anything else, so that nothing thrown during boot escapes as
// an unhandled rejection.
installProcessSafetyNet();

/**
 * Boot failures are deliberately NOT retried forever and NOT swallowed.
 *
 * WHY THE DISTINCTION MATTERS: the safety net survives unhandled rejections, so
 * a boot rejection that nobody catches would leave a process that is alive but
 * never connected to Discord — worse than a crash, because systemd sees a
 * healthy unit. Anything that prevents the gateway session must therefore end
 * the process with a non-zero status and let systemd restart it.
 */
main().catch((error) => {
  logger.error("Fatal startup error", {
    error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
});

async function main(): Promise<void> {
  const config = loadConfig();

  // Runs before the client starts: a row still holding a plaintext id would be
  // readable on disk until the next restart, and the migration is idempotent so
  // running it on every boot is cheaper than getting it wrong once.
  const migration = await withTransientRetry("encryption migration", () =>
    migrateToEncryptedUserIds(config.databaseUrl, config.encryptionKey)
  );
  logger.info("Encryption migration complete", migration);

  logger.info("Registering guild commands", { guildId: config.discordGuildId });
  await withTransientRetry("register guild commands", () =>
    registerGuildCommandsWithToken(config.discordToken, {
      clientId: config.discordClientId,
      guildId: config.discordGuildId
    })
  );
  logger.info("Guild commands registered", { guildId: config.discordGuildId });

  await loginWithRetry(config);

  logger.info("Bot is running");
}

/**
 * A fresh client per attempt: `Client#login` destroys the websocket when it
 * fails, so reusing the same instance is not a supported path. Retrying covers
 * the case that actually took the unit down — the VPS briefly unable to resolve
 * discord.com — instead of leaving systemd to restart-loop the whole process.
 */
async function loginWithRetry(config: ReturnType<typeof loadConfig>, attempts = 5): Promise<Client> {
  for (let attempt = 1; ; attempt += 1) {
    const client = startClient(config);

    try {
      logger.info("Logging in Discord client", { attempt, attempts });
      await client.login(config.discordToken);
      return client;
    } catch (error) {
      await client.destroy().catch(() => undefined);

      if (attempt >= attempts || !isTransientNetworkError(error)) throw error;

      const delayMs = backoffMs(attempt);
      logger.warn("Discord login failed on a transient network error, retrying", {
        attempt,
        attempts,
        retryInMs: delayMs,
        error: error instanceof Error ? error.message : String(error),
      });
      await sleep(delayMs);
    }
  }
}

function startClient(config: ReturnType<typeof loadConfig>): Client {
  const client = createDiscordClient();
  const db = createDb(config.databaseUrl);
  const store = new DrizzleBoosterRoleStore(db, config.encryptionKey);

  // discord.js re-emits listener rejections and gateway faults as `error` on the
  // client, and an unhandled `error` event is fatal in Node. These listeners turn
  // that into a log line: a dropped gateway connection is recovered by the shard
  // manager on its own, so the process has no reason to die over it.
  client.on("error", safeListener("client error", (error) => {
    logger.error("Discord client error", { error: String(error) });
  }));
  client.on("shardError", safeListener("shard error", (error, shardId) => {
    logger.warn("Discord shard connection error, reconnecting", {
      shardId,
      error: String(error),
      transient: isTransientNetworkError(error),
    });
  }));
  client.on("shardDisconnect", safeListener("shard disconnect", (closeEvent, shardId) => {
    logger.warn("Discord shard disconnected", { shardId, code: closeEvent?.code });
  }));

  client.once("clientReady", safeListener("clientReady", () => {
    logger.info("Discord client ready", { bot: client.user?.tag ?? "unknown bot" });

    // Start periodic cleanup for boost ends missed during downtime
    startBoostCleanup(
      client,
      store,
      (guild) => new DiscordRoleRepository(guild),
      {
        intervalMs: config.boostCleanupIntervalMs,
        boosterEligibilityRoleId: config.boosterEligibilityRoleId,
        anchorRoleId: config.boosterRoleAnchorRoleId,
        retentionMs: config.retentionMs,
      },
    );
    logger.info("Boost cleanup started", { intervalMs: config.boostCleanupIntervalMs });
  }));

  attachBotHandlers(client, config);

  return client;
}

/** Network faults worth retrying: the gateway is unreachable, not unhappy with us. */
function isTransientNetworkError(error: unknown): boolean {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : "";
  const message = error instanceof Error ? error.message : String(error);

  return (
    TRANSIENT_CODES.includes(code) || TRANSIENT_MESSAGE.test(message)
  );
}

const TRANSIENT_CODES = [
  "EAI_AGAIN",
  "ENOTFOUND",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
];

const TRANSIENT_MESSAGE = /EAI_AGAIN|ENOTFOUND|ECONNRESET|ECONNREFUSED|ETIMEDOUT|socket hang up|network/i;

function backoffMs(attempt: number): number {
  return Math.min(1_000 * 2 ** (attempt - 1), 15_000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTransientRetry<T>(
  label: string,
  action: () => Promise<T>,
  attempts = 5,
): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= attempts || !isTransientNetworkError(error)) throw error;

      const delayMs = backoffMs(attempt);
      logger.warn("Transient failure, retrying", {
        step: label,
        attempt,
        attempts,
        retryInMs: delayMs,
        error: error instanceof Error ? error.message : String(error),
      });
      await sleep(delayMs);
    }
  }
}
