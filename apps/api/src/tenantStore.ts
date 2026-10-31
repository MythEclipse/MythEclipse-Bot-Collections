import type { TenantOverview, TenantSummary } from "@booster-role/contracts";

export type TenantStore = {
  findPublicBySlug(slug: string): TenantSummary | null;
  getOverview(tenantId: string, adminUserId: string): TenantOverview | null;
};

type TenantRecord = TenantOverview & { adminUserIds: string[] };

const tenants: TenantRecord[] = [
  {
    id: "tenant-demo",
    slug: "demo-server",
    name: "Demo Booster Server",
    discordGuildId: "guild-demo",
    plan: "pro",
    active: true,
    memberCount: 1284,
    managedRoleCount: 47,
    eligibleBoosterCount: 92,
    updatedAt: new Date().toISOString(),
    adminUserIds: ["demo-admin"]
  }
];

export function createTenantStore(records: TenantRecord[] = tenants): TenantStore {
  return {
    findPublicBySlug(slug) {
      const tenant = records.find((record) => record.slug === slug && record.active);
      return tenant ? toSummary(tenant) : null;
    },
    getOverview(tenantId, adminUserId) {
      const tenant = records.find(
        (record) => record.id === tenantId && record.active && record.adminUserIds.includes(adminUserId)
      );
      return tenant ? toOverview(tenant) : null;
    }
  };
}

function toSummary(tenant: TenantRecord): TenantSummary {
  const { memberCount, managedRoleCount, eligibleBoosterCount, updatedAt, adminUserIds, ...summary } = tenant;
  return summary;
}

function toOverview(tenant: TenantRecord): TenantOverview {
  const { adminUserIds, ...overview } = tenant;
  return overview;
}
