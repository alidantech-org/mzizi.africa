import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Place Elections */
export interface PlaceElections {
  elections: Record<string, unknown>[];
  gaps: NonEmptyString500[];
  place: PlaceCrumb;
  registrationTrend: Record<string, unknown>[];
  turnoutTrend: Record<string, unknown>[];
}
