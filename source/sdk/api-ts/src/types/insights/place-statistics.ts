import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Place Statistics */
export interface InsightsPlaceStatistics {
  breakdowns: unknown;
  chain: InsightsPlaceCrumb[];
  comparisons: unknown[];
  gaps: string[];
  place: InsightsPlaceCrumb;
  siblings: unknown;
  topics: unknown[];
}
