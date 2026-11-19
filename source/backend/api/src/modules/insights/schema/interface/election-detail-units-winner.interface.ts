import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Election Detail Units Winner */
export interface ElectionDetailUnitsWinner {
  margin: Number;
  name: String;
  party: String;
  partyCode: String;
  share: Number;
  votes: Number;
}
