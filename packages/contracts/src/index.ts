export type VerificationInput = {
  guildId: string;
  userId: string;
  roleId: string;
  roleName: string;
  roleManaged: boolean;
  rolePermissions: string[];
  rolePosition: number;
  anchorPosition: number;
  storedGuildId: string;
  storedUserId: string;
  storedRoleId: string;
  eligible: boolean;
};

export type VerificationResult = {
  valid: boolean;
  checks: Array<{ label: string; passed: boolean; detail: string }>;
};

export type TenantSummary = {
  id: string;
  slug: string;
  name: string;
  discordGuildId: string;
  plan: "free" | "pro";
  active: boolean;
};

export type TenantOverview = TenantSummary & {
  memberCount: number;
  managedRoleCount: number;
  eligibleBoosterCount: number;
  updatedAt: string;
};

export type BotProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "available" | "coming-soon";
  accent: string;
};

export function verifyBoosterRole(input: VerificationInput): VerificationResult {
  const checks = [
    {
      label: "Booster eligibility",
      passed: input.eligible,
      detail: input.eligible ? "User is eligible" : "User is not eligible"
    },
    {
      label: "Role ownership",
      passed:
        input.guildId === input.storedGuildId &&
        input.userId === input.storedUserId &&
        input.roleId === input.storedRoleId,
      detail: "Stored role ownership matches the requested user"
    },
    {
      label: "Bot-managed role",
      passed: input.roleManaged,
      detail: input.roleManaged ? "Role is managed by the bot" : "Role is not bot-managed"
    },
    {
      label: "Cosmetic permissions",
      passed: input.rolePermissions.length === 0,
      detail:
        input.rolePermissions.length === 0
          ? "Role has no elevated permissions"
          : `Role has ${input.rolePermissions.length} permission(s)`
    },
    {
      label: "Safe role position",
      passed: input.rolePosition < input.anchorPosition,
      detail: "Role is below the configured staff/admin anchor"
    }
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
