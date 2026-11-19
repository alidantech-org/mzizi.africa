import type { InsightsPlaceStatisticsTopicsIndicators } from "#sdk/types/insights/place-statistics-topics-indicators.ts";

/** Place Statistics Topics */
export interface InsightsPlaceStatisticsTopics {
  code: string;
  indicators: InsightsPlaceStatisticsTopicsIndicators[];
  label: string;
}
