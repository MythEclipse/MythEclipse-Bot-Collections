export type WebConfig = {
  clientId: string;
  clientSecret: string;
  sessionSecret: string;
  guildId: string;
  publicBaseUrl: string;
  databaseUrl: string | null;
  botToken: string | null;
};

/**
 * The web service reads its own secret set (`dcbot_web_*` in BWS), so it never
 * depends on the bot's env and cannot accidentally pick up a stale token.
 */
export function loadConfig(env: Record<string, string | undefined> = process.env): WebConfig {
  return {
    clientId: requireEnv(env, "DISCORD_CLIENT_ID"),
    clientSecret: requireEnv(env, "DISCORD_CLIENT_SECRET"),
    sessionSecret: requireEnv(env, "SESSION_SECRET"),
    guildId: requireEnv(env, "DISCORD_GUILD_ID"),
    publicBaseUrl: (env.PUBLIC_BASE_URL ?? "https://dcbot.asepharyana.my.id").replace(/\/+$/, ""),
    databaseUrl: env.DATABASE_URL ?? null,
    botToken: env.DISCORD_TOKEN ?? null
  };
}

/** Must match the redirect registered on the Discord application, byte for byte. */
export function callbackUrl(config: WebConfig): string {
  return `${config.publicBaseUrl}/api/auth/discord/callback`;
}

export function isSecureBase(config: WebConfig): boolean {
  return config.publicBaseUrl.startsWith("https://");
}

function requireEnv(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];
  if (!value) throw new Error(`${key} is required`);
  return value;
}
