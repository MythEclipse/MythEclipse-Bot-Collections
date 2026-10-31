import { describe, test } from "node:test";
import { expect } from "expect";
import { verifyBoosterRole } from "./index";

describe("verifyBoosterRole", () => {
  test("accepts an eligible cosmetic role owned by the user", () => {
    const result = verifyBoosterRole({
      guildId: "guild",
      userId: "user",
      roleId: "role",
      roleName: "Booster",
      roleManaged: true,
      rolePermissions: [],
      rolePosition: 4,
      anchorPosition: 10,
      storedGuildId: "guild",
      storedUserId: "user",
      storedRoleId: "role",
      eligible: true
    });

    expect(result.valid).toBe(true);
    expect(result.checks.every((check) => check.passed)).toBe(true);
  });

  test("rejects elevated permissions and an unsafe position", () => {
    const result = verifyBoosterRole({
      guildId: "guild",
      userId: "user",
      roleId: "role",
      roleName: "Booster",
      roleManaged: true,
      rolePermissions: ["ManageRoles"],
      rolePosition: 10,
      anchorPosition: 10,
      storedGuildId: "guild",
      storedUserId: "user",
      storedRoleId: "role",
      eligible: true
    });

    expect(result.valid).toBe(false);
    expect(result.checks.filter((check) => !check.passed).map((check) => check.label)).toEqual([
      "Cosmetic permissions",
      "Safe role position"
    ]);
  });
});
