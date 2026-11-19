import type { InsightsPlaceStatisticsTopicsIndicatorsLatest } from "#sdk/types/insights/place-statistics-topics-indicators-latest.ts";
import type { InsightsPlaceStatisticsTopicsIndicatorsPrevious } from "#sdk/types/insights/place-statistics-topics-indicators-previous.ts";
import type { InsightsPlaceStatisticsTopicsIndicatorsSeries } from "#sdk/types/insights/place-statistics-topics-indicators-series.ts";

/** Place Statistics Topics Indicators */
export interface InsightsPlaceStatisticsTopicsIndicators {
  change?: number | null;
  code: string;
  higherIsBetter?: boolean | null;
  latest: InsightsPlaceStatisticsTopicsIndicatorsLatest;
  measure: string;
  name: string;
  previous?: InsightsPlaceStatisticsTopicsIndicatorsPrevious | null;
  series: InsightsPlaceStatisticsTopicsIndicatorsSeries[];
  unit: string;
}
