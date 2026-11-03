export type AppConfig = {
  discordToken: string;
  discordClientId: string;
  discordGuildId: string;
  databaseUrl: string;
  boosterRoleAnchorRoleId: string | null;
  boosterEligibilityRoleId: string;
  boostCleanupIntervalMs: number;
  boosterGreetingChannelId: string | null;
  encryptionKey: string;
  retentionMs: number;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
};

/** Developer policy caps stored API data at 30 days; 29 leaves room for clock skew. */
const DEFAULT_RETENTION_DAYS = 29;

export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  return {
    discordToken: requireEnv(env, "DISCORD_TOKEN"),
    discordClientId: requireEnv(env, "DISCORD_CLIENT_ID"),
    discordGuildId: requireEnv(env, "DISCORD_GUILD_ID"),
    databaseUrl: env.DATABASE_URL ?? "postgresql://asephs:***@100.121.180.82:6432/boost",
    boosterRoleAnchorRoleId: env.BOOSTER_ROLE_ANCHOR_ROLE_ID ?? null,
    boosterEligibilityRoleId: env.BOOSTER_ELIGIBILITY_ROLE_ID ?? "1206431347925852162",
    boostCleanupIntervalMs: Number(env.BOOST_CLEANUP_INTERVAL_MS) || 5 * 60 * 1000,
    boosterGreetingChannelId: env.BOOSTER_GREETING_CHANNEL_ID ?? null,
    // Required, not defaulted: a fallback key would silently encrypt production
    // data with a value published in this repository.
    encryptionKey: requireEnv(env, "BOOSTER_ENCRYPTION_KEY"),
    retentionMs: retentionDays(env) * 86_400_000,
    privacyPolicyUrl:
      env.BOOSTER_PRIVACY_URL ?? "https://dcbot.asepharyana.my.id/apps/booster-role/privacy",
    termsOfServiceUrl:
      env.BOOSTER_TERMS_URL ?? "https://dcbot.asepharyana.my.id/apps/booster-role/terms",
  };
}

function retentionDays(env: Record<string, string | undefined>): number {
  const configured = Number(env.BOOSTER_RETENTION_DAYS);
  if (!Number.isFinite(configured) || configured <= 0) return DEFAULT_RETENTION_DAYS;
  return Math.min(configured, 30);
}

function requireEnv(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
}
