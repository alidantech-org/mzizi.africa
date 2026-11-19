import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { IndicatorSeriesIndicator } from "#/modules/insights/schema/interface/indicator-series-indicator.interface.ts";
import type { IndicatorSeriesPoints } from "#/modules/insights/schema/interface/indicator-series-points.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Indicator Series */
export interface IndicatorSeries {
  gaps: NonEmptyString500[];
  indicator: IndicatorSeriesIndicator;
  place: PlaceCrumb;
  points: IndicatorSeriesPoints[];
}
