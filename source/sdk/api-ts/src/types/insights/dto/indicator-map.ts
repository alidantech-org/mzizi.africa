import type { InsightsIndicatorMapIndicator } from "#sdk/types/insights/dto/indicator-map-indicator.ts";
import type { InsightsIndicatorMapUnits } from "#sdk/types/insights/dto/indicator-map-units.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/dto/place-crumb.ts";

/** Indicator Map */
export interface InsightsIndicatorMap {
  gaps: string[];
  indicator: InsightsIndicatorMapIndicator;
  parent?: InsightsPlaceCrumb | null;
  periodFrom?: string | null;
  units: InsightsIndicatorMapUnits[];
}
