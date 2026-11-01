import type { ManagedRoleReview, ManagedRoleReviews, VerificationResult } from "@mytheclipse/contracts";
import { verifyBoosterRole } from "@mytheclipse/contracts";
import * as React from "react";
import { useLocale } from "../i18n";
import type { MessageKey } from "../i18n/en";

/**
 * Contract check labels are the rule engine's own vocabulary; these maps turn
 * them into display copy. An unknown label falls through untranslated instead
 * of silently getting the wrong advice.
 */
const labelKeys: Record<string, MessageKey> = {
  "Booster eligibility": "check.boosterEligibility",
  "Role ownership": "check.roleOwnership",
  "Bot-managed role": "check.botManaged",
  "Cosmetic permissions": "check.cosmeticPermissions",
  "Safe role position": "check.safePosition"
};

const fixKeys: Record<string, MessageKey> = {
  "Booster eligibility": "fix.boosterEligibility",
  "Role ownership": "fix.roleOwnership",
  "Bot-managed role": "fix.botManaged",
  "Cosmetic permissions": "fix.cosmeticPermissions",
  "Safe role position": "fix.safePosition"
};

/**
 * The dashboard's main panel: every role the bot created, judged by the same
 * contract the bot enforces. Nothing here is typed by hand.
 */
export function RoleSafety({ reviews }: { reviews: ManagedRoleReviews }): React.ReactElement {
  const { t, formatTime } = useLocale();
  const total = reviews.roles.length;
  const safe = reviews.roles.filter((role) => role.result.valid).length;
  const failing = total - safe;

  if (total === 0) {
    return (
      <section className="role-safety">
        <h2>{t("roles.heading")}</h2>
        <p className="empty">{t("roles.empty")}</p>
      </section>
    );
  }

  return (
    <section className="role-safety">
      <div className="dashboard-heading">
        <div>
          <h2>{t("roles.heading")}</h2>
          <p className="muted">{t("roles.summary", { safe, total })}</p>
        </div>
        <span className={failing === 0 ? "status" : "status status-fail"}>
          {failing === 0 ? t("roles.allSafe") : failing === 1 ? t("roles.attentionOne") : t("roles.attention", { count: failing })}
        </span>
      </div>
      <ul className="role-list">
        {reviews.roles.map((role) => (
          <RoleRow key={role.roleId} role={role} />
        ))}
      </ul>
      <p className="muted">{t("dash.readAt", { time: formatTime(reviews.fetchedAt) })}</p>
    </section>
  );
}

function RoleRow({ role }: { role: ManagedRoleReview }): React.ReactElement {
  const { t } = useLocale();
  const failing = role.result.checks.filter((check) => !check.passed);

  return (
    <li className={role.result.valid ? "role-row" : "role-row role-row-fail"}>
      <div className="role-row-head">
        <strong>{role.roleName}</strong>
        <span className={role.result.valid ? "status" : "status status-fail"}>
          {role.result.valid ? t("roles.safe") : t("roles.rejected")}
        </span>
      </div>
      <p className="muted">{t("roles.member", { id: role.userId })}</p>
      {failing.length > 0 && (
        <ul className="role-row-fails">
          {failing.map((check) => {
            const fixKey = fixKeys[check.label];
            return (
              <li key={check.label}>
                <strong>{labelKeys[check.label] ? t(labelKeys[check.label]) : check.label}</strong>: {check.detail}.{" "}
                {fixKey ? t(fixKey) : ""}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

type RoleState = {
  userId: string;
  roleId: string;
  storedUserId: string;
  storedRoleId: string;
  roleManaged: boolean;
  eligible: boolean;
  rolePermissions: string;
  rolePosition: string;
  anchorPosition: string;
};

const sampleState: RoleState = {
  userId: "100000000000000001",
  roleId: "100000000000000002",
  storedUserId: "100000000000000001",
  storedRoleId: "100000000000000002",
  roleManaged: true,
  eligible: true,
  rolePermissions: "",
  rolePosition: "4",
  anchorPosition: "10"
};

/**
 * The contract playground, kept for whoever maintains the rules. It is folded
 * away by default because it is not what a server admin came for.
 */
export function RoleDiagnostics({ guildId }: { guildId: string }): React.ReactElement {
  const { t } = useLocale();
  const [state, setState] = React.useState<RoleState>(sampleState);
  const update = <Key extends keyof RoleState>(key: Key, value: RoleState[Key]) =>
    setState((current) => ({ ...current, [key]: value }));

  const result = verifyBoosterRole({
    guildId,
    userId: state.userId.trim(),
    roleId: state.roleId.trim(),
    roleName: "",
    roleManaged: state.roleManaged,
    rolePermissions: parsePermissions(state.rolePermissions),
    rolePosition: parsePosition(state.rolePosition),
    anchorPosition: parsePosition(state.anchorPosition),
    storedGuildId: guildId,
    storedUserId: state.storedUserId.trim(),
    storedRoleId: state.storedRoleId.trim(),
    eligible: state.eligible
  });

  return (
    <details className="diagnostics">
      <summary>{t("diag.summary")}</summary>
      <p className="muted">{t("diag.note")}</p>

      <div className="verifier-grid">
        <label>
          {t("diag.userId")}
          <input value={state.userId} onChange={(event) => update("userId", event.target.value)} />
        </label>
        <label>
          {t("diag.roleId")}
          <input value={state.roleId} onChange={(event) => update("roleId", event.target.value)} />
        </label>
        <label>
          {t("diag.storedUserId")}
          <input value={state.storedUserId} onChange={(event) => update("storedUserId", event.target.value)} />
        </label>
        <label>
          {t("diag.storedRoleId")}
          <input value={state.storedRoleId} onChange={(event) => update("storedRoleId", event.target.value)} />
        </label>
        <label>
          {t("diag.rolePosition")}
          <input
            inputMode="numeric"
            value={state.rolePosition}
            onChange={(event) => update("rolePosition", event.target.value)}
          />
        </label>
        <label>
          {t("diag.anchorPosition")}
          <input
            inputMode="numeric"
            value={state.anchorPosition}
            onChange={(event) => update("anchorPosition", event.target.value)}
          />
        </label>
        <label className="verifier-wide">
          {t("diag.permissions")}
          <input
            placeholder={t("diag.permissionsPlaceholder")}
            value={state.rolePermissions}
            onChange={(event) => update("rolePermissions", event.target.value)}
          />
        </label>
        <label className="verifier-check">
          <input
            type="checkbox"
            checked={state.roleManaged}
            onChange={(event) => update("roleManaged", event.target.checked)}
          />
          {t("diag.managed")}
        </label>
        <label className="verifier-check">
          <input type="checkbox" checked={state.eligible} onChange={(event) => update("eligible", event.target.checked)} />
          {t("diag.eligible")}
        </label>
      </div>

      <div className="check-table-wrap" role="region" aria-label={t("diag.region")} tabIndex={0}>
        <CheckTable result={result} />
      </div>
    </details>
  );
}

function CheckTable({ result }: { result: VerificationResult }): React.ReactElement {
  const { t } = useLocale();

  return (
    <table className="check-table">
      <caption>{t("diag.caption")}</caption>
      <thead>
        <tr>
          <th scope="col">{t("diag.check")}</th>
          <th scope="col">{t("diag.detail")}</th>
          <th scope="col">{t("diag.result")}</th>
        </tr>
      </thead>
      <tbody>
        {result.checks.map((check) => (
          <tr key={check.label} className={check.passed ? "check-pass" : "check-fail"}>
            <td>{labelKeys[check.label] ? t(labelKeys[check.label]) : check.label}</td>
            <td>{check.detail}</td>
            <td>{check.passed ? t("diag.pass") : t("diag.fail")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function parsePermissions(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parsePosition(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
