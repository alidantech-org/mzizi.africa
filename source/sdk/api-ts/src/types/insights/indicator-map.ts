import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Indicator Map */
export interface InsightsIndicatorMap {
  gaps: string[];
  indicator: unknown;
  parent?: InsightsPlaceCrumb | null;
  periodFrom?: string | null;
  units: unknown[];
}
