import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { loadConfig } from "./config";
import { createBoosterRoleStore } from "./db";
import { createDiscordGuildSource, type OverviewSources } from "./guildOverview";
import { createDiscordRoleSource, type ManagedRoleSources } from "./managedRoles";

const config = loadConfig();
const port = Number(process.env.PORT ?? 4025);
const store = config.databaseUrl ? createBoosterRoleStore(config.databaseUrl) : null;

const sources: OverviewSources = {
  fetchGuild: config.botToken
    ? createDiscordGuildSource(config.botToken)
    : async () => {
        throw new Error("DISCORD_TOKEN is not set, so the guild cannot be read");
      },
  countManagedRoles: store ? store.countManagedRoles : async () => null
};

const roles: ManagedRoleSources | undefined =
  config.botToken && store
    ? { ...createDiscordRoleSource(config.botToken), listStoredRoles: store.listStoredRoles }
    : undefined;

serve({ fetch: createApp({ config, overview: sources, roles }).fetch, port });
console.log(`Booster Role API listening on http://localhost:${port}`);
