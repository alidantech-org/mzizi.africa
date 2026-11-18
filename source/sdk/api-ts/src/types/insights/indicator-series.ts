import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Indicator Series */
export interface InsightsIndicatorSeries {
  gaps: string[];
  indicator: unknown;
  place: InsightsPlaceCrumb;
  points: unknown[];
}
