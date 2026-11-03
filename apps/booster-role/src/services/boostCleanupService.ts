import { logger } from "../logger";
import type { Client, Guild } from "discord.js";
import type { BoosterRoleStore } from "./boosterRoleStore";
import type { RoleRepository } from "./roleRepository";

export type CleanupServiceOptions = {
  intervalMs: number;
  boosterEligibilityRoleId: string;
  anchorRoleId: string | null;
  retentionMs: number;
};

/**
 * Periodically scans all guilds for booster roles whose owners are no longer
 * boosting (missed due to bot downtime). Removes orphan custom roles and
 * database records.
 */
export function startBoostCleanup(
  client: Client,
  store: BoosterRoleStore,
  repoFactory: (guild: Guild) => RoleRepository,
  options: CleanupServiceOptions,
): { stop: () => void } {
  const timer = setInterval(() => {
    runCleanup(client, store, repoFactory, options).catch((err) => {
      logger.error("Boost cleanup cycle failed", { error: String(err) });
    });
  }, options.intervalMs);

  // Run once immediately on startup too
  runCleanup(client, store, repoFactory, options).catch((err) => {
    logger.error("Boost initial cleanup failed", { error: String(err) });
  });

  return {
    stop: () => clearInterval(timer),
  };
}

async function runCleanup(
  client: Client,
  store: BoosterRoleStore,
  repoFactory: (guild: Guild) => RoleRepository,
  options: CleanupServiceOptions,
): Promise<void> {
  const guilds = client.guilds.cache;

  for (const guild of guilds.values()) {
    try {
      await cleanupGuild(guild, store, repoFactory(guild), options);
    } catch (err) {
      logger.error("Boost cleanup failed for guild", {
        guildId: guild.id,
        error: String(err),
      });
    }
  }
}

async function cleanupGuild(
  guild: Guild,
  store: BoosterRoleStore,
  roles: RoleRepository,
  options: CleanupServiceOptions,
): Promise<void> {
  // Fetch fresh member data to check current booster eligibility
  await guild.members.fetch();

  const records = await store.findByGuild(guild.id);

  for (const record of records) {
    // A record whose stored id could not be decrypted has no owner we can verify.
    // Keeping it would mean retaining personal data we cannot even read, so it is
    // removed on the same path as an owner who left.
    if (record.userId === "") {
      logger.warn("Boost cleanup: unreadable user id, removing record", {
        guildId: guild.id,
        roleId: record.roleId,
      });
      await roles.deleteRole(record.roleId);
      await store.delete(guild.id, record.userId);
      continue;
    }

    const member = guild.members.cache.get(record.userId);

    // Member left the server entirely → remove role + record
    if (!member) {
      logger.info("Boost cleanup: member left guild, removing role", {
        guildId: guild.id,
        userId: record.userId,
        roleId: record.roleId,
      });
      await roles.deleteRole(record.roleId);
      await store.delete(guild.id, record.userId);
      continue;
    }

    // Member still here but no longer has the booster eligibility role
    const hasBoosterRole = member.roles.cache.has(options.boosterEligibilityRoleId);
    if (!hasBoosterRole) {
      logger.info("Boost cleanup: member lost boost, removing role", {
        guildId: guild.id,
        userId: record.userId,
        roleId: record.roleId,
      });
      await roles.deleteRole(record.roleId);
      await store.delete(guild.id, record.userId);
      continue;
    }

    // Retention ceiling. A role that is still legitimate but older than the
    // published retention window is deleted and the member may claim again: the
    // developer policy caps how long stored API data may be kept, and a booster
    // who has held the same role for months is exactly the case that would
    // otherwise sit past it forever.
    const age = Date.now() - record.updatedAt;
    if (age > options.retentionMs) {
      logger.info("Boost cleanup: record exceeded retention window, removing role", {
        guildId: guild.id,
        userId: record.userId,
        roleId: record.roleId,
        ageDays: Math.floor(age / 86_400_000),
      });
      await roles.deleteRole(record.roleId);
      await store.delete(guild.id, record.userId);
    }
  }
}
