import { verifyBoosterRole } from "@booster-role/contracts";
import * as React from "react";

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

const initialState: RoleState = {
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

/**
 * Runs the same checks the bot applies before it touches a role. The rules live
 * in `@booster-role/contracts`, so this page can never drift from the bot.
 */
export function RoleVerifier({ guildId }: { guildId: string }): React.ReactElement {
  const [state, setState] = React.useState<RoleState>(initialState);
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
    <section className="verifier">
      <div className="verifier-heading">
        <div>
          <p className="eyebrow">Role safety</p>
          <h2>Verify a booster role</h2>
        </div>
        <span className={result.valid ? "status" : "status status-fail"}>
          {result.valid ? "● Safe to keep" : "● Would be rejected"}
        </span>
      </div>

      <div className="verifier-grid">
        <label>
          Discord user ID
          <input value={state.userId} onChange={(event) => update("userId", event.target.value)} />
        </label>
        <label>
          Discord role ID
          <input value={state.roleId} onChange={(event) => update("roleId", event.target.value)} />
        </label>
        <label>
          Stored user ID
          <input value={state.storedUserId} onChange={(event) => update("storedUserId", event.target.value)} />
        </label>
        <label>
          Stored role ID
          <input value={state.storedRoleId} onChange={(event) => update("storedRoleId", event.target.value)} />
        </label>
        <label>
          Role position
          <input
            inputMode="numeric"
            value={state.rolePosition}
            onChange={(event) => update("rolePosition", event.target.value)}
          />
        </label>
        <label>
          Anchor position
          <input
            inputMode="numeric"
            value={state.anchorPosition}
            onChange={(event) => update("anchorPosition", event.target.value)}
          />
        </label>
        <label className="verifier-wide">
          Role permissions (comma separated)
          <input
            placeholder="ManageRoles, KickMembers"
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
          Role is managed by the bot
        </label>
        <label className="verifier-check">
          <input type="checkbox" checked={state.eligible} onChange={(event) => update("eligible", event.target.checked)} />
          User is currently boosting
        </label>
      </div>

      <table className="check-table">
        <tbody>
          {result.checks.map((check) => (
            <tr key={check.label} className={check.passed ? "check-pass" : "check-fail"}>
              <td>{check.label}</td>
              <td>{check.detail}</td>
              <td>{check.passed ? "Pass" : "Fail"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
