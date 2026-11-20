import type { InsightsPlaceStatisticsTopicsIndicators } from "#sdk/types/insights/dto/place-statistics-topics-indicators.ts";

/** Place Statistics Topics */
export interface InsightsPlaceStatisticsTopics {
  code: string;
  indicators: InsightsPlaceStatisticsTopicsIndicators[];
  label: string;
}
