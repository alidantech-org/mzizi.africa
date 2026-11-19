import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election Detail Units Candidates */
export interface ElectionDetailUnitsCandidates {
  name: String;
  party: String;
  partyCode: String;
  share: Number;
  votes: Number;
}
