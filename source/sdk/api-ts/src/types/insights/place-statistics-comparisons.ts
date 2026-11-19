import type { InsightsPlaceStatisticsComparisonsPlace } from "#sdk/types/insights/place-statistics-comparisons-place.ts";

/** Place Statistics Comparisons */
export interface InsightsPlaceStatisticsComparisons {
  areaKm2?: number | null;
  density?: number | null;
  place: InsightsPlaceStatisticsComparisonsPlace;
  population?: number | null;
}
