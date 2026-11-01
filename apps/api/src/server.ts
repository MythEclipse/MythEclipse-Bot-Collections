import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { loadConfig } from "./config";
import { createRoleCounter } from "./db";
import { createDiscordGuildSource, type OverviewSources } from "./guildOverview";

const config = loadConfig();
const port = Number(process.env.PORT ?? 4025);

const sources: OverviewSources = {
  fetchGuild: config.botToken
    ? createDiscordGuildSource(config.botToken)
    : async () => {
        throw new Error("DISCORD_TOKEN is not set, so the guild cannot be read");
      },
  countManagedRoles: config.databaseUrl ? createRoleCounter(config.databaseUrl) : async () => null
};

serve({ fetch: createApp({ config, overview: sources }).fetch, port });
console.log(`Booster Role API listening on http://localhost:${port}`);
