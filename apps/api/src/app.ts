import { cors } from "hono/cors";
import { Hono } from "hono";
import type { TenantStore } from "./tenantStore";
import { createTenantStore } from "./tenantStore";
import type { BotProduct } from "@booster-role/contracts";

const botProducts: BotProduct[] = [
  {
    id: "booster-role",
    slug: "booster-role",
    name: "Booster Role",
    tagline: "Cosmetic roles that respect your server.",
    description: "Give boosters a safe, polished way to express themselves without touching staff permissions.",
    status: "available",
    accent: "#c6f36b"
  },
  {
    id: "community-guard",
    slug: "community-guard",
    name: "Community Guard",
    tagline: "Moderation signals for busy communities.",
    description: "A focused moderation companion for incident alerts, onboarding, and safer community operations.",
    status: "coming-soon",
    accent: "#8ed8ff"
  }
];

export function createApp(store: TenantStore = createTenantStore()) {
  const app = new Hono();

  app.use("/api/*", cors());

  app.get("/api/health", (context) => context.json({ ok: true, service: "booster-role-api" }));

  app.get("/api/public/bots", (context) => context.json({ bots: botProducts }));

  app.get("/api/public/tenants/:slug", (context) => {
    const tenant = store.findPublicBySlug(context.req.param("slug"));
    if (!tenant) return context.json({ error: "Server not found" }, 404);
    return context.json({ tenant });
  });

  app.get("/api/admin/tenants/:tenantId/overview", (context) => {
    const adminUserId = context.req.header("x-admin-user");
    if (!adminUserId) return context.json({ error: "Authentication required" }, 401);

    const overview = store.getOverview(context.req.param("tenantId"), adminUserId);
    if (!overview) return context.json({ error: "Tenant not found or access denied" }, 404);
    return context.json({ overview });
  });

  return app;
}
