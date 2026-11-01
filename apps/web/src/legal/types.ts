import type * as React from "react";

export type LegalDocumentKind = "privacy" | "terms";

export type LegalDocument = {
  updated: string;
  body: React.ReactElement;
};

/**
 * One entry per bot in the collection. `slug` must match the product slug the
 * API serves, so a bot's legal pages and its catalogue card can never disagree
 * about which app they describe.
 */
export type AppLegal = {
  slug: string;
  name: string;
  summary: string;
  privacy: LegalDocument;
  terms: LegalDocument;
};

export const contactEmail = "superaseph@gmail.com";
export const lastUpdated = "November 1, 2026";
