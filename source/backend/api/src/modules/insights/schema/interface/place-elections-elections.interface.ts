import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { PlaceElectionsElectionsContests } from "#/modules/insights/schema/interface/place-elections-elections-contests.interface.ts";

/** Place Elections Elections */
export interface PlaceElectionsElections {
  contests: PlaceElectionsElectionsContests[];
  electionId: String;
  heldOn: String;
  kind: String;
  year: Number;
}
