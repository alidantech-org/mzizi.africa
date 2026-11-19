import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Indicator Map Indicator */
export interface IndicatorMapIndicator {
  code: String;
  higherIsBetter?: Flag | null;
  name: String;
  unit: String;
}
