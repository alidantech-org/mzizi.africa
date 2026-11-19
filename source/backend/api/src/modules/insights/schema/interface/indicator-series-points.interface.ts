import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Indicator Series Points */
export interface IndicatorSeriesPoints {
  estimated: Flag;
  period: String;
  value: Number;
}
