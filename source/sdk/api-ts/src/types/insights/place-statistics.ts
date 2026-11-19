import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";
import type { InsightsPlaceStatisticsBreakdowns } from "#sdk/types/insights/place-statistics-breakdowns.ts";
import type { InsightsPlaceStatisticsComparisons } from "#sdk/types/insights/place-statistics-comparisons.ts";
import type { InsightsPlaceStatisticsSiblings } from "#sdk/types/insights/place-statistics-siblings.ts";
import type { InsightsPlaceStatisticsTopics } from "#sdk/types/insights/place-statistics-topics.ts";

/** Place Statistics */
export interface InsightsPlaceStatistics {
  breakdowns: InsightsPlaceStatisticsBreakdowns;
  chain: InsightsPlaceCrumb[];
  comparisons: InsightsPlaceStatisticsComparisons[];
  gaps: string[];
  place: InsightsPlaceCrumb;
  siblings: InsightsPlaceStatisticsSiblings;
  topics: InsightsPlaceStatisticsTopics[];
}
