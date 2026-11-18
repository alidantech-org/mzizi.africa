import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Indicator Series */
export interface IndicatorSeries {
  gaps: NonEmptyString500[];
  indicator: Record<string, unknown>;
  place: PlaceCrumb;
  points: Record<string, unknown>[];
}
