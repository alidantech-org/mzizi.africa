import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { ElectionDetailUnitsCandidates } from "#/modules/insights/schema/interface/election-detail-units-candidates.interface.ts";
import type { ElectionDetailUnitsWinner } from "#/modules/insights/schema/interface/election-detail-units-winner.interface.ts";

/** Election Detail Units */
export interface ElectionDetailUnits {
  ballotsCast: Number;
  candidates: ElectionDetailUnitsCandidates[];
  featureId: String;
  geometry?: unknown | null;
  name: String;
  path: String;
  registered: Number;
  rejected: Number;
  turnout: Number;
  validVotes: Number;
  winner: ElectionDetailUnitsWinner;
}
