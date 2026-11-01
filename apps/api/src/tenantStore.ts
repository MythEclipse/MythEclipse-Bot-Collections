import type { TenantSummary } from "@mytheclipse/contracts";

export type TenantStore = {
  findPublicBySlug(slug: string): TenantSummary | null;
};

/**
 * Public lookup only. The admin dashboard reads live data from Discord and the
 * bot's own table (`guildOverview.ts`), so this store stays a thin demo surface
 * for the landing page instead of pretending to be a tenant database.
 */
const tenants: TenantSummary[] = [
  {
    id: "tenant-demo",
    slug: "demo-server",
    name: "Demo Booster Server",
    discordGuildId: "guild-demo",
    plan: "pro",
    active: true
  }
];

export function createTenantStore(records: TenantSummary[] = tenants): TenantStore {
  return {
    findPublicBySlug(slug) {
      return records.find((record) => record.slug === slug && record.active) ?? null;
    }
  };
}
