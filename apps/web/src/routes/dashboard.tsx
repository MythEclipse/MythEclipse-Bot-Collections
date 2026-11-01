import type { GuildOverview, SessionUser } from "@mytheclipse/contracts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { discordLoginUrl, fetchGuildOverview, fetchManagedRoles, fetchSession, signOut } from "../api";
import { RoleDiagnostics, RoleSafety } from "../components/role-safety";
import { useLocale } from "../i18n";
import type { MessageKey } from "../i18n/en";

/** Set by the OAuth callback when it redirects back without a session. */
const authMessageKeys: Record<string, MessageKey> = {
  denied: "dash.auth.denied",
  state: "dash.auth.state",
  error: "dash.auth.error"
};

export function DashboardPage(): React.ReactElement {
  const { t } = useLocale();
  const session = useQuery({ queryKey: ["auth", "session"], queryFn: fetchSession });
  const signedIn = session.data !== undefined;
  const overview = useQuery({ queryKey: ["admin", "overview"], queryFn: fetchGuildOverview, enabled: signedIn });
  const roles = useQuery({ queryKey: ["admin", "roles"], queryFn: fetchManagedRoles, enabled: signedIn });

  return (
    <main className="dashboard container" id="main">
      <div className="dashboard-top">
        <div>
          <h1>{t("dash.h1")}</h1>
          <p className="lead">{t("dash.lead")}</p>
        </div>
        {session.data && <Avatar user={session.data.user} />}
      </div>

      {session.isPending && <p className="muted">{t("dash.checking")}</p>}

      {session.isError && <SignIn notice={authNotice(t)} />}

      {signedIn && (
        <>
          <SignedInBar user={session.data.user} />
          {overview.isPending && <p className="muted">{t("dash.loadingServer")}</p>}
          {overview.isError && (
            <ErrorNote
              message={t("dash.loadError")}
              detail={overview.error.message}
              onRetry={() => void overview.refetch()}
            />
          )}
          {overview.data && <OverviewCard overview={overview.data.overview} />}

          {roles.isPending && overview.data && <p className="muted">{t("dash.rolesLoading")}</p>}
          {roles.isError && (
            <ErrorNote
              message={t("dash.rolesError")}
              detail={roles.error.message}
              onRetry={() => void roles.refetch()}
            />
          )}
          {roles.data && <RoleSafety reviews={roles.data.reviews} />}
          {overview.data && <RoleDiagnostics guildId={overview.data.overview.guildId} />}
        </>
      )}
    </main>
  );
}

function authNotice(t: (key: MessageKey) => string): string | null {
  const flag = new URLSearchParams(window.location.search).get("auth");
  const key = flag ? authMessageKeys[flag] : undefined;
  return key ? t(key) : null;
}

function SignIn({ notice }: { notice: string | null }): React.ReactElement {
  const { t } = useLocale();

  return (
    <section className="admin-form">
      <h2>{t("dash.signIn.heading")}</h2>
      <p className="muted">{t("dash.signIn.body")}</p>
      {notice && <p className="form-error">{notice}</p>}
      <a className="button" href={discordLoginUrl()}>
        {t("dash.signIn.button")}
      </a>
    </section>
  );
}

function SignedInBar({ user }: { user: SessionUser }): React.ReactElement {
  const { t } = useLocale();
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
        {t("dash.signedInAs")} <strong>{user.name}</strong>
      </span>
      <button className="text-link" type="button" onClick={() => void handleSignOut()} disabled={pending}>
        {pending ? t("dash.signingOut") : t("dash.signOut")}
      </button>
    </div>
  );
}

function Avatar({ user }: { user: SessionUser }): React.ReactElement {
  return (
    <span className="avatar" aria-hidden="true">
      {initials(user.name)}
    </span>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "ME";
}

function OverviewCard({ overview }: { overview: GuildOverview }): React.ReactElement {
  const { t, formatTime } = useLocale();

  return (
    <div className="metrics">
      <div className="dashboard-heading">
        <div>
          <h2>{overview.name}</h2>
          <p className="muted">{t("dash.guild", { id: overview.guildId })}</p>
        </div>
        <span className="status">{t("dash.connected")}</span>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>{t("metric.members")}</span>
          <strong>{overview.memberCount.toLocaleString()}</strong>
        </div>
        <div className="metric">
          <span>{t("metric.boosters")}</span>
          <strong>{overview.boosterCount.toLocaleString()}</strong>
        </div>
        <div className="metric">
          <span>{t("metric.managedRoles")}</span>
          <strong>{overview.managedRoleCount === null ? "—" : overview.managedRoleCount.toLocaleString()}</strong>
        </div>
      </div>
      <p className="muted">{t("dash.readAt", { time: formatTime(overview.fetchedAt) })}</p>
    </div>
  );
}

function ErrorNote({
  message,
  detail,
  onRetry
}: {
  message: string;
  detail: string;
  onRetry: () => void;
}): React.ReactElement {
  const { t } = useLocale();

  return (
    <div className="form-error error-note" role="alert">
      <p>{message}</p>
      <p className="error-detail">{detail}</p>
      <button className="text-link" type="button" onClick={onRetry}>
        {t("dash.retry")}
      </button>
    </div>
  );
}
