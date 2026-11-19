import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Civic Fund */
export interface PlaceCivicFund {
  code: String;
  funds: Number;
  managedBy: String;
}
