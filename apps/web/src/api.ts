import type { BotProduct, TenantOverview, TenantSummary } from "@booster-role/contracts";

/**
 * Empty by default so production is same-origin: Caddy serves this SPA and
 * proxies /api to the Hono service. Dev sets VITE_API_URL or uses the vite
 * proxy declared in vite.config.ts.
 */
const apiUrl = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, init);
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return (await response.json()) as T;
}

async function readError(response: Response): Promise<string> {
  const body = await response.text().catch(() => "");
  try {
    const parsed = JSON.parse(body) as { error?: string };
    if (parsed.error) return parsed.error;
  } catch {
    // Not JSON: fall through to the raw body or the status code.
  }
  return body || `Request failed (${response.status})`;
}

export function fetchProducts(): Promise<{ bots: BotProduct[] }> {
  return request("/api/public/bots");
}

export function fetchTenant(slug: string): Promise<{ tenant: TenantSummary }> {
  return request(`/api/public/tenants/${encodeURIComponent(slug)}`);
}

/**
 * `adminUser` is the documented development auth boundary: the API accepts it
 * as the `x-admin-user` header until Discord OAuth replaces it.
 */
export function fetchTenantOverview(tenantId: string, adminUser: string): Promise<{ overview: TenantOverview }> {
  return request(`/api/admin/tenants/${encodeURIComponent(tenantId)}/overview`, {
    headers: { "x-admin-user": adminUser }
  });
}
