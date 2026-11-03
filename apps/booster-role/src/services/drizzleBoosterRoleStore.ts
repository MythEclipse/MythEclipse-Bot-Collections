import { createHmac } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { boosterRoles } from "../db/schema";
import { FieldCipher } from "./fieldCipher";
import type {
  BoosterRoleRecord,
  BoosterRoleStore,
  BoosterRoleUpdate
} from "./boosterRoleStore";

export type { BoosterRoleRecord, BoosterRoleStore, BoosterRoleUpdate } from "./boosterRoleStore";

type SelectQuery = {
  where(condition: unknown): QueryWithLimit & Promise<BoosterRoleRowLike[]>;
};

type QueryWithLimit = {
  limit(count: number): Promise<BoosterRoleRowLike[]> | BoosterRoleRowLike[];
};

type BoosterRoleRowLike = {
  guildId: string;
  userId: string;
  userIdHash: string;
  roleId: string;
  name: string;
  color: string | null;
  color2: string | null;
  icon: string | null;
  createdAt: number;
  updatedAt: number;
};

type InsertValues = Omit<BoosterRoleRowLike, "userIdHash"> & { userIdHash: string };

type DatabaseLike = {
  select(): {
    from(table: typeof boosterRoles): SelectQuery;
  };
  insert(table: typeof boosterRoles): {
    values(record: InsertValues): Promise<unknown> | unknown;
  };
  update(table: typeof boosterRoles): {
    set(changes: BoosterRoleUpdate): {
      where(condition: unknown): Promise<unknown> | unknown;
    };
  };
  delete(table: typeof boosterRoles): {
    where(condition: unknown): Promise<unknown> | unknown;
  };
};

/**
 * Persists booster roles, keeping the booster's Discord user id encrypted.
 *
 * WHY A BLIND INDEX EXISTS: the user id is stored as AES-GCM ciphertext with a
 * fresh random IV per write, so two rows holding the same id never look alike and
 * `WHERE user_id = $1` can never match. Lookups therefore go through
 * `user_id_hash`, a deterministic HMAC of (guild id, user id). The hash is keyed,
 * so it cannot be recomputed from a leaked dump without the key, and it is scoped
 * per guild, so the same member in two servers yields two unrelated hashes.
 *
 * Every value crossing this boundary is plaintext: callers keep working with real
 * user ids, and the encryption is invisible to them.
 */
export class DrizzleBoosterRoleStore implements BoosterRoleStore {
  private readonly cipher: FieldCipher;
  private readonly indexKey: string;

  constructor(
    private readonly db: DatabaseLike,
    encryptionKey: string,
  ) {
    this.cipher = new FieldCipher(encryptionKey);
    this.indexKey = encryptionKey;
  }

  async findByUser(guildId: string, userId: string): Promise<BoosterRoleRecord | null> {
    const rows = await this.db
      .select()
      .from(boosterRoles)
      .where(and(eq(boosterRoles.guildId, guildId), eq(boosterRoles.userIdHash, this.blindIndex(guildId, userId))))
      .limit(1);

    return rows[0] ? this.toRecord(rows[0]) : null;
  }

  async findByGuild(guildId: string): Promise<BoosterRoleRecord[]> {
    const rows = await this.db
      .select()
      .from(boosterRoles)
      .where(eq(boosterRoles.guildId, guildId));

    return rows.map((row) => this.toRecord(row));
  }

  async create(record: BoosterRoleRecord): Promise<void> {
    await this.db.insert(boosterRoles).values({
      ...record,
      userId: this.cipher.encrypt(record.userId, record.guildId),
      userIdHash: this.blindIndex(record.guildId, record.userId),
    });
  }

  async update(guildId: string, userId: string, changes: BoosterRoleUpdate): Promise<void> {
    await this.db
      .update(boosterRoles)
      .set(changes)
      .where(and(eq(boosterRoles.guildId, guildId), eq(boosterRoles.userIdHash, this.blindIndex(guildId, userId))));
  }

  async delete(guildId: string, userId: string): Promise<void> {
    await this.db
      .delete(boosterRoles)
      .where(and(eq(boosterRoles.guildId, guildId), eq(boosterRoles.userIdHash, this.blindIndex(guildId, userId))));
  }

  private blindIndex(guildId: string, userId: string): string {
    return createHmac("sha256", this.indexKey)
      .update(`${guildId}:${userId}`)
      .digest("hex");
  }

  /**
   * A row whose ciphertext cannot be authenticated yields a record with an empty
   * user id rather than an exception: one unreadable row must not abort a cleanup
   * sweep over the whole guild. Such a row matches no member, so the cleanup
   * deletes it — which is the correct outcome for data nobody can decrypt.
   */
  private toRecord(row: BoosterRoleRowLike): BoosterRoleRecord {
    return {
      guildId: row.guildId,
      userId: this.cipher.decrypt(row.userId, row.guildId) ?? "",
      roleId: row.roleId,
      name: row.name,
      color: row.color,
      color2: row.color2,
      icon: row.icon,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
