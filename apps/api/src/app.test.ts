import { describe, test } from "node:test";
import { expect } from "expect";
import { createApp } from "./app";
import { createTenantStore } from "./tenantStore";

describe("tenant API", () => {
  const app = createApp(createTenantStore());

  test("serves only active public tenant summaries", async () => {
    const response = await app.request("/api/public/tenants/demo-server");
    expect(response.status).toBe(200);
    expect((await response.json()).tenant.id).toBe("tenant-demo");
  });

  test("requires tenant-scoped admin authentication", async () => {
    const unauthorized = await app.request("/api/admin/tenants/tenant-demo/overview");
    expect(unauthorized.status).toBe(401);

    const denied = await app.request("/api/admin/tenants/tenant-demo/overview", {
      headers: { "x-admin-user": "someone-else" }
    });
    expect(denied.status).toBe(404);

    const allowed = await app.request("/api/admin/tenants/tenant-demo/overview", {
      headers: { "x-admin-user": "demo-admin" }
    });
    expect(allowed.status).toBe(200);
    expect((await allowed.json()).overview.memberCount).toBe(1284);
  });
});
