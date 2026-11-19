import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Statistics Topics Indicators Previous */
export interface PlaceStatisticsTopicsIndicatorsPrevious {
  estimated: Flag;
  period: String;
  value: Number;
}
