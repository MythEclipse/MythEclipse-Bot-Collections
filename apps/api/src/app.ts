import { Hono } from "hono";
import { cors } from "hono/cors";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { BotProduct } from "@mytheclipse/contracts";
import { callbackUrl, isSecureBase, type WebConfig } from "./config";
import { loadGuildOverview, type OverviewSources } from "./guildOverview";
import { loadManagedRoleReviews, type ManagedRoleSources } from "./managedRoles";
import {
  authorizeUrl,
  exchangeCode,
  fetchGuilds,
  fetchUser,
  findManageableGuild,
  type DiscordGuild,
  type DiscordUser
} from "./oauth";
import {
  randomToken,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  STATE_COOKIE,
  STATE_TTL_SECONDS,
  signSession,
  verifySession
} from "./session";
import { createTenantStore, type TenantStore } from "./tenantStore";

const botProducts: BotProduct[] = [
  {
    id: "booster-role",
    slug: "booster-role",
    name: "Booster Role",
    tagline: "Cosmetic roles that respect your server.",
    description: "Give boosters a safe, polished way to express themselves without touching staff permissions.",
    status: "available",
    accent: "#c6f36b",
    command: "/booster-role claim"
  },
  {
    id: "community-guard",
    slug: "community-guard",
    name: "Community Guard",
    tagline: "Moderation signals for busy communities.",
    description: "A focused moderation companion for incident alerts, onboarding, and safer community operations.",
    status: "coming-soon",
    accent: "#8ed8ff",
    command: null
  }
];

export type OAuthGateway = {
  exchangeCode(input: { clientId: string; clientSecret: string; code: string; redirectUri: string }): Promise<string>;
  fetchUser(accessToken: string): Promise<DiscordUser>;
  fetchGuilds(accessToken: string): Promise<DiscordGuild[]>;
};

export type AppDeps = {
  config: WebConfig;
  tenants?: TenantStore;
  oauth?: OAuthGateway;
  overview?: OverviewSources;
  roles?: ManagedRoleSources;
  now?: () => number;
};

export function createApp(deps: AppDeps) {
  const { config } = deps;
  const tenants = deps.tenants ?? createTenantStore();
  const oauth: OAuthGateway = deps.oauth ?? { exchangeCode, fetchUser, fetchGuilds };
  const now = deps.now ?? (() => Date.now());
  const dashboardUrl = `${config.publicBaseUrl}/dashboard`;
  const cookieOptions = {
    httpOnly: true,
    sameSite: "Lax" as const,
    path: "/",
    secure: isSecureBase(config)
  };

  const app = new Hono();

  app.use("/api/*", cors());

  app.get("/api/health", (context) => context.json({ ok: true, service: "booster-role-api" }));

  app.get("/api/public/bots", (context) => context.json({ bots: botProducts }));

  app.get("/api/public/tenants/:slug", (context) => {
    const tenant = tenants.findPublicBySlug(context.req.param("slug"));
    if (!tenant) return context.json({ error: "Server not found" }, 404);
    return context.json({ tenant });
  });

  // ── Discord OAuth ────────────────────────────────────────────────────────
  app.get("/api/auth/discord", (context) => {
    const state = randomToken();
    setCookie(context, STATE_COOKIE, state, { ...cookieOptions, maxAge: STATE_TTL_SECONDS });
    context.header("cache-control", "no-store");
    return context.redirect(
      authorizeUrl({ clientId: config.clientId, redirectUri: callbackUrl(config), state })
    );
  });

  app.get("/api/auth/discord/callback", async (context) => {
    const expectedState = getCookie(context, STATE_COOKIE);
    deleteCookie(context, STATE_COOKIE, { path: "/" });

    const code = context.req.query("code");
    const state = context.req.query("state");
    if (!code || !state || !expectedState || state !== expectedState) {
      return context.redirect(`${dashboardUrl}?auth=state`);
    }

    try {
      const accessToken = await oauth.exchangeCode({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        code,
        redirectUri: callbackUrl(config)
      });
      const user = await oauth.fetchUser(accessToken);
      const guilds = await oauth.fetchGuilds(accessToken);
      if (!findManageableGuild(guilds, config.guildId)) {
        return context.redirect(`${dashboardUrl}?auth=denied`);
      }

      setCookie(
        context,
        SESSION_COOKIE,
        signSession(config.sessionSecret, {
          user: { id: user.id, name: user.globalName ?? user.username },
          expiresAt: now() + SESSION_TTL_MS
        }),
        { ...cookieOptions, maxAge: Math.floor(SESSION_TTL_MS / 1000) }
      );
      return context.redirect(dashboardUrl);
    } catch {
      return context.redirect(`${dashboardUrl}?auth=error`);
    }
  });

  app.get("/api/auth/session", (context) => {
    context.header("cache-control", "no-store");
    const session = verifySession(config.sessionSecret, getCookie(context, SESSION_COOKIE), now());
    if (!session) return context.json({ error: "Not signed in" }, 401);
    return context.json({ user: session.user, expiresAt: session.expiresAt });
  });

  app.post("/api/auth/logout", (context) => {
    deleteCookie(context, SESSION_COOKIE, { path: "/" });
    return context.body(null, 204);
  });

  // The session is only issued to someone who could manage the guild at login
  // time; it carries that decision for its lifetime instead of re-asking
  // Discord on every dashboard request.
  app.get("/api/admin/overview", async (context) => {
    context.header("cache-control", "no-store");
    const session = verifySession(config.sessionSecret, getCookie(context, SESSION_COOKIE), now());
    if (!session) return context.json({ error: "Sign in with Discord to open the dashboard" }, 401);
    if (!deps.overview) return context.json({ error: "Dashboard data source is not configured" }, 503);

    try {
      const overview = await loadGuildOverview(config.guildId, deps.overview);
      return context.json({ overview, user: session.user });
    } catch {
      return context.json({ error: "Could not load this server from Discord" }, 502);
    }
  });

  // The roles the bot created, judged by the same contract the bot enforces.
  // Same session gate as the overview: one login decision covers the dashboard.
  app.get("/api/admin/roles", async (context) => {
    context.header("cache-control", "no-store");
    const session = verifySession(config.sessionSecret, getCookie(context, SESSION_COOKIE), now());
    if (!session) return context.json({ error: "Sign in with Discord to open the dashboard" }, 401);
    if (!deps.roles) return context.json({ error: "Role data source is not configured" }, 503);

    try {
      const reviews = await loadManagedRoleReviews(config.guildId, deps.roles);
      return context.json({ reviews, user: session.user });
    } catch {
      return context.json({ error: "Could not read this server's roles from Discord" }, 502);
    }
  });

  return app;
}
