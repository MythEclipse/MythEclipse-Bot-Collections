const DISCORD_API = "https://discord.com/api/v10";

// A guild owner always carries ADMINISTRATOR in the permissions bitfield that
// /users/@me/guilds returns, so these two bits are enough to answer "may this
// person manage the workspace?" without asking the bot.
const ADMINISTRATOR = 0x8n;
const MANAGE_GUILD = 0x20n;

export type DiscordUser = {
  id: string;
  username: string;
  globalName: string | null;
};

export type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
};

export function authorizeUrl(input: { clientId: string; redirectUri: string; state: string }): string {
  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", input.clientId);
  url.searchParams.set("redirect_uri", input.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify guilds");
  url.searchParams.set("state", input.state);
  url.searchParams.set("prompt", "none");
  return url.toString();
}

export async function exchangeCode(input: {
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
}): Promise<string> {
  const body = new URLSearchParams({
    client_id: input.clientId,
    client_secret: input.clientSecret,
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirectUri
  });
  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  if (!response.ok) {
    throw new Error(`Discord rejected the authorization code (${response.status})`);
  }
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("Discord returned no access token");
  }
  return payload.access_token;
}

export async function fetchUser(accessToken: string): Promise<DiscordUser> {
  const payload = await getJson<{ id: string; username: string; global_name?: string | null }>(
    `${DISCORD_API}/users/@me`,
    accessToken
  );
  return { id: payload.id, username: payload.username, globalName: payload.global_name ?? null };
}

export async function fetchGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const payload = await getJson<Array<{ id: string; name: string; permissions: string }>>(
    `${DISCORD_API}/users/@me/guilds`,
    accessToken
  );
  return payload.map((guild) => ({ id: guild.id, name: guild.name, permissions: guild.permissions }));
}

export function canManageGuild(permissions: string): boolean {
  let bits: bigint;
  try {
    bits = BigInt(permissions);
  } catch {
    return false;
  }
  return (bits & ADMINISTRATOR) === ADMINISTRATOR || (bits & MANAGE_GUILD) === MANAGE_GUILD;
}

export function findManageableGuild(guilds: DiscordGuild[], guildId: string): DiscordGuild | null {
  return guilds.find((guild) => guild.id === guildId && canManageGuild(guild.permissions)) ?? null;
}

async function getJson<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!response.ok) {
    throw new Error(`Discord API ${url} failed (${response.status})`);
  }
  return (await response.json()) as T;
}
