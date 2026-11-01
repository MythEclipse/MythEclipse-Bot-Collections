import postgres from "postgres";

/**
 * Counts the roles the bot actually created for a guild. Read-only, tiny pool:
 * the API only ever runs this one query.
 */
export function createRoleCounter(databaseUrl: string): (guildId: string) => Promise<number> {
  const sql = postgres(databaseUrl, { max: 2, idle_timeout: 20 });
  return async (guildId) => {
    const rows = await sql<{ count: string }[]>`
      select count(*)::text as count from booster_roles where guild_id = ${guildId}
    `;
    return Number(rows[0]?.count ?? 0);
  };
}
