import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PlaceStatisticsComparisonsPlace } from "#/modules/insights/schema/interface/place-statistics-comparisons-place.interface.ts";

/** Place Statistics Comparisons */
export interface PlaceStatisticsComparisons {
  areaKm2?: Number | null;
  density?: Number | null;
  place: PlaceStatisticsComparisonsPlace;
  population?: Number | null;
}
