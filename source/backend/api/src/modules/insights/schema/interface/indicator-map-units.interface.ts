import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Indicator Map Units */
export interface IndicatorMapUnits {
  estimated: Flag;
  featureId: String;
  geometry?: unknown | null;
  kind: String;
  name: String;
  path: String;
  rank: Number;
  value: Number;
}
