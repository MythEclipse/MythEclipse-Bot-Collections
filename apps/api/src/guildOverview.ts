import type { GuildOverview } from "@mytheclipse/contracts";

export type GuildSnapshot = {
  id: string;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  boosterCount: number;
};

/**
 * Everything the overview needs from outside this process, injected so the
 * mapping can be tested without Discord or Postgres.
 */
export type OverviewSources = {
  fetchGuild(guildId: string): Promise<GuildSnapshot>;
  countManagedRoles(guildId: string): Promise<number | null>;
  now?: () => Date;
};

export async function loadGuildOverview(guildId: string, sources: OverviewSources): Promise<GuildOverview> {
  const guild = await sources.fetchGuild(guildId);
  // A broken database must not take the whole dashboard down: the Discord facts
  // are still true, so the role count degrades to null and renders as "—".
  const managedRoleCount = await sources.countManagedRoles(guildId).catch(() => null);

  return {
    guildId: guild.id,
    name: guild.name,
    iconUrl: guild.iconUrl,
    memberCount: guild.memberCount,
    boosterCount: guild.boosterCount,
    managedRoleCount,
    fetchedAt: (sources.now?.() ?? new Date()).toISOString()
  };
}

export function createDiscordGuildSource(botToken: string): (guildId: string) => Promise<GuildSnapshot> {
  return async (guildId) => {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: { authorization: `Bot ${botToken}` }
    });
    if (!response.ok) {
      throw new Error(`Discord guild lookup failed (${response.status})`);
    }
    const payload = (await response.json()) as {
      id: string;
      name: string;
      icon: string | null;
      approximate_member_count?: number;
      premium_subscription_count?: number;
    };
    return {
      id: payload.id,
      name: payload.name,
      iconUrl: payload.icon ? `https://cdn.discordapp.com/icons/${payload.id}/${payload.icon}.png?size=128` : null,
      memberCount: payload.approximate_member_count ?? 0,
      boosterCount: payload.premium_subscription_count ?? 0
    };
  };
}
