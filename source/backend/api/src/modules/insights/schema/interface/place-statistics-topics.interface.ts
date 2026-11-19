import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { PlaceStatisticsTopicsIndicators } from "#/modules/insights/schema/interface/place-statistics-topics-indicators.interface.ts";

/** Place Statistics Topics */
export interface PlaceStatisticsTopics {
  code: String;
  indicators: PlaceStatisticsTopicsIndicators[];
  label: String;
}
