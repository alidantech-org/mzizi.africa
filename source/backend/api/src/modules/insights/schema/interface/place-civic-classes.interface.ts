import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Civic Classes */
export interface PlaceCivicClasses {
  amount: Number;
  code: String;
  label: String;
}
