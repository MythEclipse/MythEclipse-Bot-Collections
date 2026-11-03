import { loadConfig } from "./config";
import { createDb } from "./db";
import { attachBotHandlers } from "./discord/bot";
import { createDiscordClient } from "./discord/client";
import { registerGuildCommandsWithToken } from "./discord/registerCommands";
import { startBoostCleanup } from "./services/boostCleanupService";
import { migrateToEncryptedUserIds } from "./db/migrateEncryption";
import { DiscordRoleRepository } from "./services/discordRoleRepository";
import { DrizzleBoosterRoleStore } from "./services/drizzleBoosterRoleStore";
import { logger } from "./logger";

const config = loadConfig();

// Runs before the client starts: a row still holding a plaintext id would be
// readable on disk until the next restart, and the migration is idempotent so
// running it on every boot is cheaper than getting it wrong once.
const migration = await migrateToEncryptedUserIds(config.databaseUrl, config.encryptionKey);
logger.info("Encryption migration complete", migration);

logger.info("Registering guild commands", { guildId: config.discordGuildId });
await registerGuildCommandsWithToken(config.discordToken, {
  clientId: config.discordClientId,
  guildId: config.discordGuildId
});
logger.info("Guild commands registered", { guildId: config.discordGuildId });

const client = createDiscordClient();
const db = createDb(config.databaseUrl);
const store = new DrizzleBoosterRoleStore(db, config.encryptionKey);

client.once("clientReady", () => {
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
});

attachBotHandlers(client, config);

logger.info("Logging in Discord client");
await client.login(config.discordToken);
