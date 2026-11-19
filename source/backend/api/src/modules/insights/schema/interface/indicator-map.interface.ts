import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { IndicatorMapIndicator } from "#/modules/insights/schema/interface/indicator-map-indicator.interface.ts";
import type { IndicatorMapUnits } from "#/modules/insights/schema/interface/indicator-map-units.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Indicator Map */
export interface IndicatorMap {
  gaps: NonEmptyString500[];
  indicator: IndicatorMapIndicator;
  parent?: PlaceCrumb | null;
  periodFrom?: CalendarDate | null;
  units: IndicatorMapUnits[];
}
