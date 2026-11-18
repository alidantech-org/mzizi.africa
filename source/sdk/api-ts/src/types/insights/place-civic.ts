import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Place Civic */
export interface InsightsPlaceCivic {
  chain: InsightsPlaceCrumb[];
  classes: unknown[];
  fund?: unknown | null;
  gaps: string[];
  infrastructure: unknown;
  leadership: unknown[];
  place: InsightsPlaceCrumb;
  projects: unknown[];
  years: unknown[];
}
