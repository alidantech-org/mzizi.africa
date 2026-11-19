import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { PlaceElectionsElectionsContestsCandidates } from "#/modules/insights/schema/interface/place-elections-elections-contests-candidates.interface.ts";

/** Place Elections Elections Contests */
export interface PlaceElectionsElectionsContests {
  ballotsCast: Number;
  candidates: PlaceElectionsElectionsContestsCandidates[];
  kind: String;
  registered: Number;
  turnout: Number;
}
