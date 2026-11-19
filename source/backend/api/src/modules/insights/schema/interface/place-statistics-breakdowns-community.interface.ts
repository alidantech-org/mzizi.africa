import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Statistics Breakdowns Community */
export interface PlaceStatisticsBreakdownsCommunity {
  label: String;
  share: Number;
  value: Number;
}
