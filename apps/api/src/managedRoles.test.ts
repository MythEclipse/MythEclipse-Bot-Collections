import { describe, test } from "node:test";
import { expect } from "expect";
import { loadManagedRoleReviews, type ManagedRoleSources } from "./managedRoles";

const now = () => new Date("2026-11-01T00:00:00.000Z");

const sources = (overrides: Partial<ManagedRoleSources> = {}): ManagedRoleSources => ({
  fetchRoleSnapshot: async () => ({
    roles: [
      { id: "role-safe", name: "Booster · Mira", position: 4, permissions: "0" },
      { id: "role-greedy", name: "Booster · Kai", position: 12, permissions: "1099511627776" }
    ],
    anchorPosition: 10
  }),
  listStoredRoles: async () => [
    { userId: "user-1", roleId: "role-safe" },
    { userId: "user-2", roleId: "role-greedy" }
  ],
  isBoosting: async () => true,
  now,
  ...overrides
});

describe("managed role reviews", () => {
  test("judges a cosmetic role as safe and a permissioned one as rejected", async () => {
    const reviews = await loadManagedRoleReviews("guild-1", sources());

    expect(reviews.guildId).toBe("guild-1");
    expect(reviews.fetchedAt).toBe("2026-11-01T00:00:00.000Z");
    expect(reviews.roles).toHaveLength(2);

    const [safe, greedy] = reviews.roles;
    expect(safe?.roleName).toBe("Booster · Mira");
    expect(safe?.result.valid).toBe(true);
    expect(greedy?.result.valid).toBe(false);
    expect(greedy?.result.checks.find((check) => check.label === "Cosmetic permissions")?.passed).toBe(false);
    expect(greedy?.result.checks.find((check) => check.label === "Safe role position")?.passed).toBe(false);
  });

  test("reports a stored role that no longer exists in Discord", async () => {
    const reviews = await loadManagedRoleReviews(
      "guild-1",
      sources({ listStoredRoles: async () => [{ userId: "user-3", roleId: "role-gone" }] })
    );

    expect(reviews.roles[0]?.roleName).toBe("Role no longer in Discord");
    expect(reviews.roles[0]?.result.valid).toBe(false);
    expect(reviews.roles[0]?.result.checks.find((check) => check.label === "Bot-managed role")?.passed).toBe(false);
  });

  test("a failed member lookup degrades to not boosting instead of throwing", async () => {
    const reviews = await loadManagedRoleReviews(
      "guild-1",
      sources({
        isBoosting: async () => {
          throw new Error("Discord 403");
        }
      })
    );

    expect(reviews.roles[0]?.result.checks.find((check) => check.label === "Booster eligibility")?.passed).toBe(false);
  });
});
