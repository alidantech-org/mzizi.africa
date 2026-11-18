import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Place Elections */
export interface InsightsPlaceElections {
  elections: unknown[];
  gaps: string[];
  place: InsightsPlaceCrumb;
  registrationTrend: unknown[];
  turnoutTrend: unknown[];
}
