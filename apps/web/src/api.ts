import type { BotProduct, GuildOverview, SessionUser, TenantSummary } from "@booster-role/contracts";

/**
 * Empty by default so production is same-origin: Caddy serves this SPA and
 * proxies /api to the Hono service. Dev sets VITE_API_URL or uses the vite
 * proxy declared in vite.config.ts.
 */
const apiUrl = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    // The dashboard session is an HttpOnly cookie; send it on the same-origin
    // production path and on a cross-origin VITE_API_URL in dev.
    credentials: "include",
    ...init
  });
  if (!response.ok) {
    throw new ApiError(await readError(response), response.status);
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

export function fetchSession(): Promise<{ user: SessionUser; expiresAt: number }> {
  return request("/api/auth/session");
}

export function fetchGuildOverview(): Promise<{ overview: GuildOverview; user: SessionUser }> {
  return request("/api/admin/overview");
}

export async function signOut(): Promise<void> {
  await fetch(`${apiUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
}

/** Full-page navigation, not a fetch: Discord has to own the redirect chain. */
export function discordLoginUrl(): string {
  return `${apiUrl}/api/auth/discord`;
}
