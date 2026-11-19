import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { ElectionListElectionsRunnerUp } from "#/modules/insights/schema/interface/election-list-elections-runner-up.interface.ts";
import type { ElectionListElectionsWinner } from "#/modules/insights/schema/interface/election-list-elections-winner.interface.ts";

/** Election List Elections */
export interface ElectionListElections {
  code: String;
  contests: Number;
  electionId: String;
  heldOn: String;
  kind: String;
  registeredVoters?: Number | null;
  runnerUp?: ElectionListElectionsRunnerUp | null;
  validVotes?: Number | null;
  winner?: ElectionListElectionsWinner | null;
  year: Number;
}
