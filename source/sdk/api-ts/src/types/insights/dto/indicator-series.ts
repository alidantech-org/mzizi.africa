import type { InsightsIndicatorSeriesIndicator } from "#sdk/types/insights/dto/indicator-series-indicator.ts";
import type { InsightsIndicatorSeriesPoints } from "#sdk/types/insights/dto/indicator-series-points.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/dto/place-crumb.ts";

/** Indicator Series */
export interface InsightsIndicatorSeries {
  gaps: string[];
  indicator: InsightsIndicatorSeriesIndicator;
  place: InsightsPlaceCrumb;
  points: InsightsIndicatorSeriesPoints[];
}
