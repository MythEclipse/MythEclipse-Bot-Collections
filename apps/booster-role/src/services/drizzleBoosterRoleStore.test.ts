import { describe, test } from "node:test";
import { expect } from "expect";
import {
  DrizzleBoosterRoleStore,
  type BoosterRoleRowLike,
  type BoosterRoleUpdate,
} from "./drizzleBoosterRoleStore";

const KEY = "test-key-0123456789abcdef0123456789";

type Row = BoosterRoleRowLike & Record<string, unknown>;

class FakeDb {
  rows: Row[] = [];
  inserted: Row[] = [];
  lastUpdate: { changes: BoosterRoleUpdate; condition: unknown } | null = null;

  select() {
    return {
      from: () => ({
        where: () => Object.assign(Promise.resolve(this.rows), {
          limit: (count: number) => Promise.resolve(this.rows.slice(0, count))
        })
      })
    };
  }

  insert() {
    return {
      values: (record: Row) => {
        this.inserted.push(record);
        this.rows.push(record);
      }
    };
  }

  update() {
    return {
      set: (changes: BoosterRoleUpdate) => ({
        where: (condition: unknown) => {
          this.lastUpdate = { changes, condition };
        }
      })
    };
  }

  delete() {
    return {
      where: () => {}
    };
  }
}

describe("DrizzleBoosterRoleStore", () => {
  test("persists metadata updates for a stored booster role", async () => {
    const db = new FakeDb();
    const store = new DrizzleBoosterRoleStore(db, KEY);

    await store.update("guild", "user", { name: "Renamed", color: "#AABBCC", updatedAt: 123 });

    expect(db.lastUpdate?.changes).toEqual({ name: "Renamed", color: "#AABBCC", updatedAt: 123 });
    expect(db.lastUpdate?.condition).toBeDefined();
  });

  test("stores the user id encrypted and never in plaintext", async () => {
    const db = new FakeDb();
    const store = new DrizzleBoosterRoleStore(db, KEY);

    await store.create({
      guildId: "guild",
      userId: "352042144430817281",
      roleId: "role",
      name: "Custom",
      color: "#AABBCC",
      color2: null,
      icon: null,
      createdAt: 1,
      updatedAt: 1,
    });

    const written = db.inserted[0];
    expect(String(written.userId)).not.toContain("352042144430817281");
    expect(String(written.userId).startsWith("v1:")).toBe(true);
    expect(String(written.userIdHash)).toMatch(/^[0-9a-f]{64}$/);
  });

  test("gives the same member different hashes in different guilds", async () => {
    const db = new FakeDb();
    const store = new DrizzleBoosterRoleStore(db, KEY);
    const base = { userId: "352042144430817281", roleId: "role", name: "C", color: null, color2: null, icon: null, createdAt: 1, updatedAt: 1 };

    await store.create({ ...base, guildId: "guild-a" });
    await store.create({ ...base, guildId: "guild-b" });

    expect(db.inserted[0].userIdHash).not.toBe(db.inserted[1].userIdHash);
  });
});
