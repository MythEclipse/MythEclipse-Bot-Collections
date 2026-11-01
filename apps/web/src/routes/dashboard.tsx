import type { GuildOverview, SessionUser } from "@mytheclipse/contracts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { discordLoginUrl, fetchGuildOverview, fetchSession, signOut } from "../api";
import { RoleVerifier } from "../components/role-verifier";

/** Set by the OAuth callback when it redirects back without a session. */
const authMessages: Record<string, string> = {
  denied: "Akun Discord itu bukan administrator server ini, jadi workspace-nya tidak dibuka.",
  state: "Sesi login kedaluwarsa atau tidak cocok. Coba masuk lagi.",
  error: "Discord menolak proses login. Coba lagi sebentar lagi."
};

export function DashboardPage(): React.ReactElement {
  const session = useQuery({ queryKey: ["auth", "session"], queryFn: fetchSession });
  const signedIn = session.data !== undefined;
  const overview = useQuery({ queryKey: ["admin", "overview"], queryFn: fetchGuildOverview, enabled: signedIn });

  return (
    <main className="dashboard container">
      <div className="dashboard-top">
        <div>
          <p className="eyebrow">Server admin</p>
          <h1>Your workspace.</h1>
          <p className="lead">Live state of the server Booster Role runs in.</p>
        </div>
        {session.data && <Avatar user={session.data.user} />}
      </div>

      {session.isPending && <p className="muted">Checking your session…</p>}

      {session.isError && <SignIn notice={authNotice()} />}

      {signedIn && (
        <>
          <SignedInBar user={session.data.user} />
          {overview.isPending && <p className="muted">Loading the server from Discord…</p>}
          {overview.isError && <p className="form-error">{overview.error.message}</p>}
          {overview.data && (
            <>
              <OverviewCard overview={overview.data.overview} />
              <RoleVerifier guildId={overview.data.overview.guildId} />
            </>
          )}
        </>
      )}
    </main>
  );
}

function authNotice(): string | null {
  const flag = new URLSearchParams(window.location.search).get("auth");
  return flag ? (authMessages[flag] ?? null) : null;
}

function SignIn({ notice }: { notice: string | null }): React.ReactElement {
  return (
    <section className="admin-form">
      <h2>Sign in to manage this server</h2>
      <p className="muted">
        Login memakai Discord dan hanya membuka workspace kalau akunmu punya izin Administrator atau Manage Server di
        server ini.
      </p>
      {notice && <p className="form-error">{notice}</p>}
      <a className="button" href={discordLoginUrl()}>
        Continue with Discord
      </a>
    </section>
  );
}

function SignedInBar({ user }: { user: SessionUser }): React.ReactElement {
  const queryClient = useQueryClient();
  const [pending, setPending] = React.useState(false);

  async function handleSignOut(): Promise<void> {
    setPending(true);
    await signOut();
    queryClient.clear();
    window.location.assign("/dashboard");
  }

  return (
    <div className="session-bar">
      <span>
        Signed in as <strong>{user.name}</strong>
      </span>
      <button className="text-link" type="button" onClick={() => void handleSignOut()} disabled={pending}>
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}

function Avatar({ user }: { user: SessionUser }): React.ReactElement {
  return <span className="avatar">{initials(user.name)}</span>;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "ME";
}

function OverviewCard({ overview }: { overview: GuildOverview }): React.ReactElement {
  return (
    <div className="metrics">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Guild {overview.guildId}</p>
          <h2>{overview.name}</h2>
        </div>
        <span className="status">● Connected</span>
      </div>
      <div className="metric-grid">
        <div>
          <span>Members</span>
          <strong>{overview.memberCount.toLocaleString()}</strong>
        </div>
        <div>
          <span>Boosters</span>
          <strong>{overview.boosterCount.toLocaleString()}</strong>
        </div>
        <div>
          <span>Managed roles</span>
          <strong>{overview.managedRoleCount === null ? "—" : overview.managedRoleCount.toLocaleString()}</strong>
        </div>
      </div>
      <p className="muted">Read from Discord at {new Date(overview.fetchedAt).toLocaleString()}</p>
    </div>
  );
}
