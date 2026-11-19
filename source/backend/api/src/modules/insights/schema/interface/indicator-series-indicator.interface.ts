import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Indicator Series Indicator */
export interface IndicatorSeriesIndicator {
  code: String;
  description: String;
  higherIsBetter?: Flag | null;
  name: String;
  unit: String;
}
