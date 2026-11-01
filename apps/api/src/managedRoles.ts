import { verifyBoosterRole, type ManagedRoleReview, type ManagedRoleReviews } from "@mytheclipse/contracts";
import type { StoredBoosterRole } from "./db";

/** The slice of a Discord guild role the safety rules actually read. */
export type GuildRole = { id: string; name: string; position: number; permissions: string };

/**
 * `anchorPosition` is the highest position the bot itself holds: anything at or
 * above it cannot be managed, so it is the line every cosmetic role must stay
 * below.
 */
export type GuildRoleSnapshot = { roles: GuildRole[]; anchorPosition: number };

/**
 * Everything the review needs from outside this process, injected so the
 * mapping can be tested without Discord or Postgres.
 */
export type ManagedRoleSources = {
  fetchRoleSnapshot(guildId: string): Promise<GuildRoleSnapshot>;
  listStoredRoles(guildId: string): Promise<StoredBoosterRole[]>;
  isBoosting(guildId: string, userId: string): Promise<boolean>;
  now?: () => Date;
};

export async function loadManagedRoleReviews(
  guildId: string,
  sources: ManagedRoleSources
): Promise<ManagedRoleReviews> {
  const [snapshot, stored] = await Promise.all([
    sources.fetchRoleSnapshot(guildId),
    sources.listStoredRoles(guildId)
  ]);

  const roles: ManagedRoleReview[] = await Promise.all(
    stored.map(async (row) => {
      const role = snapshot.roles.find((candidate) => candidate.id === row.roleId);
      // A member lookup that fails must not hide the role: report it as not
      // boosting, which is the state the bot would act on anyway.
      const boosting = await sources.isBoosting(guildId, row.userId).catch(() => false);

      return {
        roleId: row.roleId,
        userId: row.userId,
        roleName: role?.name ?? "Role no longer in Discord",
        result: verifyBoosterRole({
          guildId,
          userId: row.userId,
          roleId: row.roleId,
          roleName: role?.name ?? "",
          roleManaged: role !== undefined,
          rolePermissions: role ? permissionBits(role.permissions) : [],
          rolePosition: role?.position ?? 0,
          anchorPosition: snapshot.anchorPosition,
          storedGuildId: guildId,
          storedUserId: row.userId,
          storedRoleId: row.roleId,
          eligible: boosting
        })
      };
    })
  );

  return { guildId, roles, fetchedAt: (sources.now?.() ?? new Date()).toISOString() };
}

/**
 * Discord sends permissions as a bitfield string. The safety rule only asks
 * whether any bit is set, so the bits themselves are the honest payload.
 */
function permissionBits(bitfield: string): string[] {
  let value: bigint;
  try {
    value = BigInt(bitfield || "0");
  } catch {
    return ["unparsed"];
  }

  const bits: string[] = [];
  for (let index = 0n; index < 64n; index += 1n) {
    if ((value & (1n << index)) !== 0n) bits.push(index.toString());
  }
  return bits;
}

type DiscordRolePayload = { id: string; name: string; position: number; permissions: string };

export function createDiscordRoleSource(
  botToken: string
): Pick<ManagedRoleSources, "fetchRoleSnapshot" | "isBoosting"> {
  async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(`https://discord.com/api/v10${path}`, {
      headers: { authorization: `Bot ${botToken}` }
    });
    if (!response.ok) {
      throw new Error(`Discord request failed (${response.status}) for ${path}`);
    }
    return (await response.json()) as T;
  }

  return {
    async fetchRoleSnapshot(guildId) {
      const [roles, botUser] = await Promise.all([
        getJson<DiscordRolePayload[]>(`/guilds/${guildId}/roles`),
        getJson<{ id: string }>("/users/@me")
      ]);
      const botMember = await getJson<{ roles: string[] }>(`/guilds/${guildId}/members/${botUser.id}`);
      const botRoleIds = new Set(botMember.roles);

      return {
        roles: roles.map((role) => ({
          id: role.id,
          name: role.name,
          position: role.position,
          permissions: role.permissions
        })),
        anchorPosition: roles.reduce(
          (highest, role) => (botRoleIds.has(role.id) ? Math.max(highest, role.position) : highest),
          0
        )
      };
    },

    async isBoosting(guildId, userId) {
      const member = await getJson<{ premium_since?: string | null }>(`/guilds/${guildId}/members/${userId}`);
      return Boolean(member.premium_since);
    }
  };
}
