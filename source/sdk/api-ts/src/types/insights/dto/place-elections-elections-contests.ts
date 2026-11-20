import type { InsightsPlaceElectionsElectionsContestsCandidates } from "#sdk/types/insights/dto/place-elections-elections-contests-candidates.ts";

/** Place Elections Elections Contests */
export interface InsightsPlaceElectionsElectionsContests {
  ballotsCast: number;
  candidates: InsightsPlaceElectionsElectionsContestsCandidates[];
  kind: string;
  registered: number;
  turnout: number;
}
