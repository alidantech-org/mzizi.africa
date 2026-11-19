import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Statistics Breakdowns Language */
export interface PlaceStatisticsBreakdownsLanguage {
  label: String;
  share: Number;
  value: Number;
}
