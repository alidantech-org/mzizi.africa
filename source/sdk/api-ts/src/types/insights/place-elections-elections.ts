import type { InsightsPlaceElectionsElectionsContests } from "#sdk/types/insights/place-elections-elections-contests.ts";

/** Place Elections Elections */
export interface InsightsPlaceElectionsElections {
  contests: InsightsPlaceElectionsElectionsContests[];
  electionId: string;
  heldOn: string;
  kind: string;
  year: number;
}
