import { createHmac } from "node:crypto";
import postgres from "postgres";
import { FieldCipher } from "../services/fieldCipher";

/**
 * Brings an existing booster_roles table up to the encrypted layout.
 *
 * Three things have to happen, in this order:
 *   1. add `user_id_hash` (nullable at first — rows already exist),
 *   2. fill it, and encrypt any `user_id` that is still plaintext,
 *   3. make the column NOT NULL and move the unique index onto it.
 *
 * WHY IT IS SAFE TO RUN TWICE: every step checks current state before acting, and
 * a value that already decrypts is left untouched. That matters because this runs
 * on every deploy — a migration that only works on a virgin database would break
 * the second deploy, which is exactly when nobody is watching.
 *
 * WHY IT READS BEFORE IT WRITES: rows are read and re-encrypted one at a time. A
 * single unreadable row is reported and skipped instead of aborting the batch, so
 * a partially migrated table still converges on the next run.
 */
export async function migrateToEncryptedUserIds(databaseUrl: string, encryptionKey: string): Promise<{
  encrypted: number;
  skipped: number;
  failed: number;
}> {
  const sql = postgres(databaseUrl, { max: 1 });
  const cipher = new FieldCipher(encryptionKey);

  try {
    await sql`ALTER TABLE booster_roles ADD COLUMN IF NOT EXISTS user_id_hash text`;

    const rows = await sql<{ guild_id: string; user_id: string }[]>`
      SELECT guild_id, user_id FROM booster_roles
    `;

    let encrypted = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of rows) {
      const alreadyEncrypted = FieldCipher.isEncrypted(row.user_id);
      const plaintext = alreadyEncrypted
        ? cipher.decrypt(row.user_id, row.guild_id)
        : row.user_id;

      if (plaintext === null) {
        failed += 1;
        continue;
      }

      const hash = blindIndex(encryptionKey, row.guild_id, plaintext);
      const stored = alreadyEncrypted ? row.user_id : cipher.encrypt(plaintext, row.guild_id);

      if (alreadyEncrypted && stored === row.user_id) {
        await sql`UPDATE booster_roles SET user_id_hash = ${hash}
                  WHERE guild_id = ${row.guild_id} AND user_id = ${row.user_id}`;
        skipped += 1;
        continue;
      }

      await sql`UPDATE booster_roles SET user_id = ${stored}, user_id_hash = ${hash}
                WHERE guild_id = ${row.guild_id} AND user_id = ${row.user_id}`;
      encrypted += 1;
    }

    const [{ missing }] = await sql<{ missing: number }[]>`
      SELECT count(*)::int AS missing FROM booster_roles WHERE user_id_hash IS NULL
    `;

    if (missing > 0) {
      throw new Error(
        `cannot enforce NOT NULL: ${missing} row(s) still have no user_id_hash; ` +
          `fix or delete them, then redeploy`,
      );
    }

    await sql`ALTER TABLE booster_roles ALTER COLUMN user_id_hash SET NOT NULL`;
    await sql`DROP INDEX IF EXISTS booster_roles_guild_user_idx`;
    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS booster_roles_guild_user_idx
      ON booster_roles (guild_id, user_id_hash)
    `;

    return { encrypted, skipped, failed };
  } finally {
    await sql.end({ timeout: 5 });
  }
}

function blindIndex(key: string, guildId: string, userId: string): string {
  return createHmac("sha256", key).update(`${guildId}:${userId}`).digest("hex");
}
