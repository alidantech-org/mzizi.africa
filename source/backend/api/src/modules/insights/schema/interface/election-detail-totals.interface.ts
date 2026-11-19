import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election Detail Totals */
export interface ElectionDetailTotals {
  name: String;
  party: String;
  partyCode: String;
  share: Number;
  votes: Number;
}
