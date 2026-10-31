import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import type { BotProduct, TenantOverview, TenantSummary } from "@booster-role/contracts";
import * as React from "react";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8787";
const queryClient = new QueryClient();

function Shell(): React.ReactElement {
  return (
    <>
      <header className="nav container">
        <Link className="brand" to="/">
          orbit<span>bot</span>
        </Link>
        <nav>
          <Link to="/" hash="products">Products</Link>
          <Link to="/support">Support</Link>
          <Link to="/privacy">Privacy</Link>
          <Link className="nav-login" to="/dashboard">Admin login ↗</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="container footer">
        <div>
          <Link className="brand" to="/">orbit<span>bot</span></Link>
          <p>Thoughtful software for Discord communities.</p>
        </div>
        <div className="footer-links">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of service</Link>
          <Link to="/support">Support</Link>
        </div>
        <small>© 2026 orbitbot. All rights reserved.</small>
      </footer>
    </>
  );
}

function LandingPage(): React.ReactElement {
  const products = useQuery({
    queryKey: ["public", "bots"],
    queryFn: () => request<{ bots: BotProduct[] }>("/api/public/bots")
  });
  const [slug, setSlug] = React.useState("demo-server");
  const server = useQuery({
    queryKey: ["public", "tenant", slug],
    queryFn: () => request<{ tenant: TenantSummary }>(`/api/public/tenants/${encodeURIComponent(slug)}`),
    enabled: false
  });

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">The home for better Discord communities</p>
          <h1>Your server.<br /><em>More capable.</em></h1>
          <p className="lead">A calm, reliable platform for Discord bots that help communities grow, stay safe, and feel like home.</p>
          <div className="actions"><Link className="button" to="/dashboard">Manage a server</Link><a className="text-link" href="#products">Explore products ↓</a></div>
        </div>
        <div className="hero-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core">✦</div><span className="orbit-label label-one">safe by design</span><span className="orbit-label label-two">built for scale</span></div>
      </section>
      <section className="trust container"><span>POWERING THE NEXT GENERATION OF</span><b>COMMUNITIES</b><b>CREATORS</b><b>FRIENDS</b><b>TEAMS</b></section>
      <section className="section container" id="products">
        <div className="section-heading"><div><p className="eyebrow">The platform</p><h2>One home for every bot.</h2></div><p>Install the tools you need today. Add more as your community evolves. Every server gets its own isolated workspace.</p></div>
        <div className="product-grid">{products.isLoading ? <p className="muted">Loading products…</p> : products.data?.bots.map((bot) => <ProductCard key={bot.id} bot={bot} />)}</div>
      </section>
      <section className="verify-panel container">
        <div><p className="eyebrow">Public lookup</p><h2>Find your server workspace.</h2><p>Check whether a server has an active orbitbot workspace.</p></div>
        <form onSubmit={(event) => { event.preventDefault(); void server.refetch(); }}><label>Server slug<input value={slug} onChange={(event) => setSlug(event.target.value)} /></label><button className="button" type="submit">Check server</button></form>
        {server.data && <div className="server-result"><strong>{server.data.tenant.name}</strong><span>Active · {server.data.tenant.plan} workspace</span></div>}
      </section>
      <section className="cta container"><p className="eyebrow">Ready when you are</p><h2>Make your community<br /><em>feel like yours.</em></h2><Link className="button" to="/dashboard">Open your dashboard →</Link></section>
    </main>
  );
}

function ProductCard({ bot }: { bot: BotProduct }): React.ReactElement {
  return <article className="product-card" style={{ "--accent": bot.accent } as React.CSSProperties}><div className="product-icon">✦</div><span className="product-status">{bot.status === "available" ? "Available now" : "Coming soon"}</span><h3>{bot.name}</h3><p className="product-tagline">{bot.tagline}</p><p>{bot.description}</p><Link to="/dashboard">{bot.status === "available" ? "Manage bot →" : "Join the waitlist →"}</Link></article>;
}

function DashboardPage(): React.ReactElement {
  const [identity, setIdentity] = React.useState("demo-admin");
  const [tenantId, setTenantId] = React.useState("tenant-demo");
  const overview = useQuery({
    queryKey: ["admin", tenantId, identity],
    queryFn: () => request<{ overview: TenantOverview }>(`/api/admin/tenants/${encodeURIComponent(tenantId)}/overview`, { headers: { "x-admin-user": identity } }),
    enabled: false
  });

  return <main className="dashboard container"><div className="dashboard-top"><div><p className="eyebrow">Server admin</p><h1>Your workspaces.</h1><p className="lead">Manage every Discord server and bot from one place.</p></div><span className="avatar">DA</span></div><div className="notice"><strong>Demo authentication boundary</strong><span>Discord OAuth will replace this development identity field before production.</span></div><form className="admin-form" onSubmit={(event) => { event.preventDefault(); void overview.refetch(); }}><label>Workspace ID<input value={tenantId} onChange={(event) => setTenantId(event.target.value)} required /></label><label>Admin identity<input value={identity} onChange={(event) => setIdentity(event.target.value)} required /></label><button className="button" type="submit">Open workspace</button></form>{overview.data && <OverviewCard overview={overview.data.overview} />}</main>;
}

function OverviewCard({ overview }: { overview: TenantOverview }): React.ReactElement {
  return <div className="metrics"><div className="dashboard-heading"><div><p className="eyebrow">{overview.plan} plan</p><h2>{overview.name}</h2></div><span className="status">● Active</span></div><div className="metric-grid"><div><span>Members</span><strong>{overview.memberCount.toLocaleString()}</strong></div><div><span>Managed roles</span><strong>{overview.managedRoleCount}</strong></div><div><span>Eligible boosters</span><strong>{overview.eligibleBoosterCount}</strong></div></div><p className="muted">Guild ID: {overview.discordGuildId} · Updated {new Date(overview.updatedAt).toLocaleString()}</p></div>;
}

function LegalPage({ kind }: { kind: "privacy" | "terms" | "support" }): React.ReactElement {
  const pages = {
    privacy: ["Privacy policy", "Last updated: November 1, 2026", <><p>This policy explains what orbitbot collects when you use our Discord bots, website, and server dashboard.</p><h2>Information we process</h2><p>We process Discord identifiers needed to identify your account, server, and bot configuration. We store server settings and bot-managed data only to provide the features requested by a server administrator.</p><h2>Retention and deletion</h2><p>Server administrators can request deletion of their workspace. We retain limited security records when required to prevent abuse or comply with law.</p></>],
    terms: ["Terms of service", "Effective: November 1, 2026", <><p>By installing or using an orbitbot product, you agree to use it lawfully and to keep your Discord account and server permissions secure.</p><h2>Server administrator responsibility</h2><p>You must have authority to install bots and configure a server. You are responsible for reviewing role positions, permissions, and administrators granted access to your workspace.</p><h2>Acceptable use</h2><p>Do not use the platform to abuse Discord, evade moderation, distribute harmful content, or interfere with another server.</p></>],
    support: ["Support center", "We help server admins keep things moving.", <><p>Tell us what happened and include your server ID, workspace ID, and the bot feature involved. Do not send bot tokens or passwords.</p><h2>Before contacting us</h2><ul><li>Confirm the bot is still in the server.</li><li>Check that the bot role is above managed cosmetic roles.</li><li>Review the dashboard activity and server permissions.</li></ul><p className="support-card">Support email placeholder<br /><strong>support@example.com</strong></p></>]
  }[kind];
  return <main className="legal container"><p className="eyebrow">orbitbot</p><h1>{pages[0]}</h1><p className="legal-date">{pages[1]}</p><article>{pages[2]}</article></main>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, init);
  if (!response.ok) throw new Error("Request failed");
  return response.json() as Promise<T>;
}

const rootRoute = createRootRoute({ component: Shell });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: LandingPage });
const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/dashboard", component: DashboardPage });
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/privacy", component: () => <LegalPage kind="privacy" /> });
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/terms", component: () => <LegalPage kind="terms" /> });
const supportRoute = createRoute({ getParentRoute: () => rootRoute, path: "/support", component: () => <LegalPage kind="support" /> });
const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute, privacyRoute, termsRoute, supportRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router; }
}

export default function App(): React.ReactElement {
  return <QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>;
}
