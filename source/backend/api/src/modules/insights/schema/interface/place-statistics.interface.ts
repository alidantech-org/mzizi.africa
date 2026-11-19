import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";
import type { PlaceStatisticsBreakdowns } from "#/modules/insights/schema/interface/place-statistics-breakdowns.interface.ts";
import type { PlaceStatisticsComparisons } from "#/modules/insights/schema/interface/place-statistics-comparisons.interface.ts";
import type { PlaceStatisticsSiblings } from "#/modules/insights/schema/interface/place-statistics-siblings.interface.ts";
import type { PlaceStatisticsTopics } from "#/modules/insights/schema/interface/place-statistics-topics.interface.ts";

/** Place Statistics */
export interface PlaceStatistics {
  breakdowns: PlaceStatisticsBreakdowns;
  chain: PlaceCrumb[];
  comparisons: PlaceStatisticsComparisons[];
  gaps: NonEmptyString500[];
  place: PlaceCrumb;
  siblings: PlaceStatisticsSiblings;
  topics: PlaceStatisticsTopics[];
}
