import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Place Statistics */
export interface PlaceStatistics {
  breakdowns: Record<string, unknown>;
  chain: PlaceCrumb[];
  comparisons: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  place: PlaceCrumb;
  siblings: Record<string, unknown>;
  topics: Record<string, unknown>[];
}
