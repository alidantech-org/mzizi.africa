import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { PlaceStatisticsTopicsIndicatorsLatest } from "#/modules/insights/schema/interface/place-statistics-topics-indicators-latest.interface.ts";
import type { PlaceStatisticsTopicsIndicatorsPrevious } from "#/modules/insights/schema/interface/place-statistics-topics-indicators-previous.interface.ts";
import type { PlaceStatisticsTopicsIndicatorsSeries } from "#/modules/insights/schema/interface/place-statistics-topics-indicators-series.interface.ts";

/** Place Statistics Topics Indicators */
export interface PlaceStatisticsTopicsIndicators {
  change?: Number | null;
  code: String;
  higherIsBetter?: Flag | null;
  latest: PlaceStatisticsTopicsIndicatorsLatest;
  measure: String;
  name: String;
  previous?: PlaceStatisticsTopicsIndicatorsPrevious | null;
  role?: String | null;
  series: PlaceStatisticsTopicsIndicatorsSeries[];
  unit: String;
}
