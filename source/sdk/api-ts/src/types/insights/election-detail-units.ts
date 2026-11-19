import type { InsightsElectionDetailUnitsCandidates } from "#sdk/types/insights/election-detail-units-candidates.ts";
import type { InsightsElectionDetailUnitsWinner } from "#sdk/types/insights/election-detail-units-winner.ts";

/** Election Detail Units */
export interface InsightsElectionDetailUnits {
  ballotsCast: number;
  candidates: InsightsElectionDetailUnitsCandidates[];
  featureId: string;
  geometry?: unknown | null;
  name: string;
  path: string;
  registered: number;
  rejected: number;
  turnout: number;
  validVotes: number;
  winner: InsightsElectionDetailUnitsWinner;
}
