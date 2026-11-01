import { boosterRoleLegal } from "./booster-role";
import type { AppLegal } from "./types";

/**
 * Every bot that has published legal documents. Adding a bot means adding one
 * entry here; the routes are parameterised by slug, so nothing else changes.
 */
export const legalApps: AppLegal[] = [boosterRoleLegal];

export function findLegalApp(slug: string | undefined): AppLegal | undefined {
  if (!slug) return undefined;
  return legalApps.find((app) => app.slug === slug);
}
