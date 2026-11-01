import { describe, test } from "node:test";
import { expect } from "expect";
import { createApp } from "./app";
import type { WebConfig } from "./config";
import type { OAuthGateway } from "./app";
import type { OverviewSources } from "./guildOverview";
import { createTenantStore } from "./tenantStore";
import { SESSION_COOKIE, signSession, STATE_COOKIE } from "./session";

const config: WebConfig = {
  clientId: "client-id",
  clientSecret: "client-secret",
  sessionSecret: "test-secret",
  guildId: "guild-1",
  publicBaseUrl: "https://dcbot.test",
  databaseUrl: null,
  botToken: null
};

const now = () => 1_700_000_000_000;

const oauth = (overrides: Partial<OAuthGateway> = {}): OAuthGateway => ({
  exchangeCode: async () => "access-token",
  fetchUser: async () => ({ id: "user-1", username: "mytheclipse", globalName: "MythEclipse" }),
  fetchGuilds: async () => [{ id: "guild-1", name: "Server", permissions: "8" }],
  ...overrides
});

const sources: OverviewSources = {
  fetchGuild: async (guildId) => ({
    id: guildId,
    name: "Ingin Menjadi Programmer",
    iconUrl: null,
    memberCount: 12878,
    boosterCount: 53
  }),
  countManagedRoles: async () => 7,
  now: () => new Date("2026-11-01T00:00:00.000Z")
};

function makeApp(overrides: { oauth?: OAuthGateway; overview?: OverviewSources } = {}) {
  return createApp({
    config,
    tenants: createTenantStore(),
    oauth: overrides.oauth ?? oauth(),
    overview: overrides.overview ?? sources,
    now
  });
}

/** Node exposes repeated Set-Cookie headers only through getSetCookie(). */
function setCookies(response: Response): string[] {
  return response.headers.getSetCookie();
}

describe("public endpoints", () => {
  const app = makeApp();

  test("serves only active public tenant summaries", async () => {
    const response = await app.request("/api/public/tenants/demo-server");
    expect(response.status).toBe(200);
    expect((await response.json()).tenant.id).toBe("tenant-demo");
  });

  test("404s an unknown slug", async () => {
    const response = await app.request("/api/public/tenants/nope");
    expect(response.status).toBe(404);
  });
});

describe("discord oauth", () => {
  test("starts the flow with a state cookie and the discord authorize page", async () => {
    const response = await makeApp().request("/api/auth/discord");

    expect(response.status).toBe(302);
    const location = new URL(response.headers.get("location") ?? "");
    expect(location.host).toBe("discord.com");
    expect(location.searchParams.get("client_id")).toBe("client-id");
    expect(location.searchParams.get("redirect_uri")).toBe("https://dcbot.test/api/auth/discord/callback");
    expect(location.searchParams.get("scope")).toBe("identify guilds");
    expect(location.searchParams.get("state")).toBeTruthy();
    expect(setCookies(response).join("; ")).toContain(STATE_COOKIE);
  });

  test("rejects a callback whose state does not match the cookie", async () => {
    const response = await makeApp().request("/api/auth/discord/callback?code=abc&state=wrong", {
      headers: { cookie: `${STATE_COOKIE}=expected` }
    });

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://dcbot.test/dashboard?auth=state");
    expect(setCookies(response).join("; ")).not.toContain(SESSION_COOKIE);
  });

  test("issues a session for an administrator and serves the live overview", async () => {
    const app = makeApp();
    const callback = await app.request("/api/auth/discord/callback?code=abc&state=same", {
      headers: { cookie: `${STATE_COOKIE}=same` }
    });

    expect(callback.status).toBe(302);
    expect(callback.headers.get("location")).toBe("https://dcbot.test/dashboard");
    const cookie = setCookies(callback).find((value) => value.startsWith(SESSION_COOKIE))?.split(";")[0] ?? "";
    expect(cookie).toContain(SESSION_COOKIE);

    const session = await app.request("/api/auth/session", { headers: { cookie } });
    expect(session.status).toBe(200);
    expect((await session.json()).user).toEqual({ id: "user-1", name: "MythEclipse" });

    const overview = await app.request("/api/admin/overview", { headers: { cookie } });
    expect(overview.status).toBe(200);
    const body = await overview.json();
    expect(body.overview.memberCount).toBe(12878);
    expect(body.overview.boosterCount).toBe(53);
    expect(body.overview.managedRoleCount).toBe(7);
  });

  test("refuses a session to a user who cannot manage the guild", async () => {
    const response = await makeApp({
      oauth: oauth({ fetchGuilds: async () => [{ id: "guild-1", name: "Server", permissions: "1024" }] })
    }).request("/api/auth/discord/callback?code=abc&state=same", {
      headers: { cookie: `${STATE_COOKIE}=same` }
    });

    expect(response.headers.get("location")).toBe("https://dcbot.test/dashboard?auth=denied");
    expect(setCookies(response).join("; ")).not.toContain(SESSION_COOKIE);
  });

  test("redirects to the dashboard when discord rejects the code", async () => {
    const response = await makeApp({
      oauth: oauth({
        exchangeCode: async () => {
          throw new Error("bad code");
        }
      })
    }).request("/api/auth/discord/callback?code=abc&state=same", {
      headers: { cookie: `${STATE_COOKIE}=same` }
    });

    expect(response.headers.get("location")).toBe("https://dcbot.test/dashboard?auth=error");
  });
});

describe("admin overview", () => {
  test("401s without a session", async () => {
    const response = await makeApp().request("/api/admin/overview");
    expect(response.status).toBe(401);
  });

  test("401s on a forged session cookie", async () => {
    const forged = `${signSession("another-secret", { user: { id: "u", name: "n" }, expiresAt: now() + 1000 })}`;
    const response = await makeApp().request("/api/admin/overview", {
      headers: { cookie: `${SESSION_COOKIE}=${forged}` }
    });
    expect(response.status).toBe(401);
  });

  test("502s when discord cannot be read", async () => {
    const cookie = `${SESSION_COOKIE}=${signSession("test-secret", {
      user: { id: "user-1", name: "MythEclipse" },
      expiresAt: now() + 60_000
    })}`;
    const response = await makeApp({
      overview: {
        fetchGuild: async () => {
          throw new Error("discord down");
        },
        countManagedRoles: async () => 0
      }
    }).request("/api/admin/overview", { headers: { cookie } });

    expect(response.status).toBe(502);
  });

  test("degrades the role count to null when the database fails", async () => {
    const cookie = `${SESSION_COOKIE}=${signSession("test-secret", {
      user: { id: "user-1", name: "MythEclipse" },
      expiresAt: now() + 60_000
    })}`;
    const response = await makeApp({
      overview: {
        ...sources,
        countManagedRoles: async () => {
          throw new Error("db down");
        }
      }
    }).request("/api/admin/overview", { headers: { cookie } });

    expect(response.status).toBe(200);
    expect((await response.json()).overview.managedRoleCount).toBeNull();
  });
});
