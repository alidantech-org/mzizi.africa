import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Civic Years Classes */
export interface PlaceCivicYearsClasses {
  amount: Number;
  code: String;
  label: String;
  lines: Number;
}
