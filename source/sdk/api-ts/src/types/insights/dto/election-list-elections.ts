import type { InsightsElectionListElectionsRunnerUp } from "#sdk/types/insights/dto/election-list-elections-runner-up.ts";
import type { InsightsElectionListElectionsWinner } from "#sdk/types/insights/dto/election-list-elections-winner.ts";

/** Election List Elections */
export interface InsightsElectionListElections {
  code: string;
  contests: number;
  electionId: string;
  heldOn: string;
  kind: string;
  registeredVoters?: number | null;
  runnerUp?: InsightsElectionListElectionsRunnerUp | null;
  validVotes?: number | null;
  winner?: InsightsElectionListElectionsWinner | null;
  year: number;
}
