import postgres from "postgres";

export type StoredBoosterRole = { userId: string; roleId: string };

/**
 * The API's only window into the bot's own table. Read-only, tiny pool: the
 * dashboard needs a count and the role list, nothing else.
 */
export function createBoosterRoleStore(databaseUrl: string): {
  countManagedRoles(guildId: string): Promise<number>;
  listStoredRoles(guildId: string): Promise<StoredBoosterRole[]>;
} {
  const sql = postgres(databaseUrl, { max: 2, idle_timeout: 20 });

  return {
    async countManagedRoles(guildId) {
      const rows = await sql<{ count: string }[]>`
        select count(*)::text as count from booster_roles where guild_id = ${guildId}
      `;
      return Number(rows[0]?.count ?? 0);
    },

    async listStoredRoles(guildId) {
      const rows = await sql<{ user_id: string; role_id: string }[]>`
        select user_id, role_id from booster_roles where guild_id = ${guildId} order by role_id
      `;
      return rows.map((row) => ({ userId: row.user_id, roleId: row.role_id }));
    }
  };
}
