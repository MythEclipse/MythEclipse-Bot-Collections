import type { TenantOverview } from "@booster-role/contracts";
import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { fetchTenantOverview } from "../api";
import { RoleVerifier } from "../components/role-verifier";

type Workspace = {
  tenantId: string;
  adminUser: string;
};

// The demo workspace the API ships with. It loads on mount so the dashboard is
// never an empty form; the fields below are how another workspace is opened.
const demoWorkspace: Workspace = { tenantId: "tenant-demo", adminUser: "demo-admin" };

export function DashboardPage(): React.ReactElement {
  const [form, setForm] = React.useState<Workspace>(demoWorkspace);
  const [opened, setOpened] = React.useState<Workspace>(demoWorkspace);
  const overview = useQuery({
    queryKey: ["admin", "overview", opened.tenantId, opened.adminUser],
    queryFn: () => fetchTenantOverview(opened.tenantId, opened.adminUser)
  });

  return (
    <main className="dashboard container">
      <div className="dashboard-top">
        <div>
          <p className="eyebrow">Server admin</p>
          <h1>Your workspaces.</h1>
          <p className="lead">Manage every Discord server and bot from one place.</p>
        </div>
        <span className="avatar">ME</span>
      </div>

      <div className="notice">
        <strong>Demo authentication boundary</strong>
        <span>
          The API accepts the admin identity below as <code>x-admin-user</code>. Discord OAuth replaces this field
          before the dashboard handles real servers.
        </span>
      </div>

      <form
        className="admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          setOpened({ tenantId: form.tenantId.trim(), adminUser: form.adminUser.trim() });
        }}
      >
        <label>
          Workspace ID
          <input
            value={form.tenantId}
            onChange={(event) => setForm((current) => ({ ...current, tenantId: event.target.value }))}
            required
          />
        </label>
        <label>
          Admin identity
          <input
            value={form.adminUser}
            onChange={(event) => setForm((current) => ({ ...current, adminUser: event.target.value }))}
            required
          />
        </label>
        <button className="button" type="submit" disabled={overview.isFetching}>
          {overview.isFetching ? "Opening…" : "Open workspace"}
        </button>
      </form>

      {overview.isError && (
        <p className="form-error">
          {overview.error.message} · workspace <code>{opened.tenantId}</code>
        </p>
      )}

      {overview.data && <OverviewCard overview={overview.data.overview} />}

      <RoleVerifier guildId={overview.data?.overview.discordGuildId ?? "guild-demo"} />
    </main>
  );
}

function OverviewCard({ overview }: { overview: TenantOverview }): React.ReactElement {
  return (
    <div className="metrics">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">{overview.plan} plan</p>
          <h2>{overview.name}</h2>
        </div>
        <span className="status">● Active</span>
      </div>
      <div className="metric-grid">
        <div>
          <span>Members</span>
          <strong>{overview.memberCount.toLocaleString()}</strong>
        </div>
        <div>
          <span>Managed roles</span>
          <strong>{overview.managedRoleCount}</strong>
        </div>
        <div>
          <span>Eligible boosters</span>
          <strong>{overview.eligibleBoosterCount}</strong>
        </div>
      </div>
      <p className="muted">
        Guild ID: {overview.discordGuildId} · Updated {new Date(overview.updatedAt).toLocaleString()}
      </p>
    </div>
  );
}
