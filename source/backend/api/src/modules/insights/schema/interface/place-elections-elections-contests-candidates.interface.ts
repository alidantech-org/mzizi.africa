import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Elections Elections Contests Candidates */
export interface PlaceElectionsElectionsContestsCandidates {
  individualId: String;
  name: String;
  party: String;
  partyCode: String;
  share: Number;
  votes: Number;
  won: Flag;
}
