import { bigint, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

/**
 * `userId` holds AES-256-GCM ciphertext, not a Discord id — see fieldCipher.ts.
 * Because every row carries its own random IV, the column cannot be searched, so
 * `userIdHash` (a keyed HMAC of guild id + user id) is the column lookups use.
 * The plaintext id never reaches this table.
 */
export const boosterRoles = pgTable(
  "booster_roles",
  {
    guildId: text("guild_id").notNull(),
    userId: text("user_id").notNull(),
    userIdHash: text("user_id_hash").notNull(),
    roleId: text("role_id").notNull(),
    name: text("name").notNull(),
    color: text("color"),
    color2: text("color2"),
    icon: text("icon"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull()
  },
  (table) => ({
    userIdx: uniqueIndex("booster_roles_guild_user_idx").on(table.guildId, table.userIdHash),
    roleIdx: uniqueIndex("booster_roles_guild_role_idx").on(table.guildId, table.roleId)
  })
);

export type BoosterRoleRow = typeof boosterRoles.$inferSelect;
export type NewBoosterRoleRow = typeof boosterRoles.$inferInsert;
