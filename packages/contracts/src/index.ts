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

/**
 * What the dashboard shows for the one guild the bot is installed in. Every
 * number here comes from Discord or from the bot's own table — nothing is
 * hardcoded, so the page cannot drift from reality.
 */
export type GuildOverview = {
  guildId: string;
  name: string;
  iconUrl: string | null;
  memberCount: number;
  boosterCount: number;
  managedRoleCount: number | null;
  fetchedAt: string;
};

export type SessionUser = {
  id: string;
  name: string;
};

/**
 * One booster role the bot created, judged against the same rules the bot
 * applies before it touches a role. The dashboard renders this instead of
 * re-deriving the rules, so the two can never disagree.
 */
export type ManagedRoleReview = {
  roleId: string;
  userId: string;
  roleName: string;
  result: VerificationResult;
};

export type ManagedRoleReviews = {
  guildId: string;
  roles: ManagedRoleReview[];
  fetchedAt: string;
};

export type BotProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "available" | "coming-soon";
  accent: string;
  /** The slash command a member actually types, when the bot has one. */
  command: string | null;
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