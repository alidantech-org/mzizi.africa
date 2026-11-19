import type { InsightsElectionDetailContests } from "#sdk/types/insights/election-detail-contests.ts";
import type { InsightsElectionDetailElection } from "#sdk/types/insights/election-detail-election.ts";
import type { InsightsElectionDetailTotals } from "#sdk/types/insights/election-detail-totals.ts";
import type { InsightsElectionDetailUnits } from "#sdk/types/insights/election-detail-units.ts";

/** Election Detail */
export interface InsightsElectionDetail {
  contests: InsightsElectionDetailContests[];
  election: InsightsElectionDetailElection;
  gaps: string[];
  totals: InsightsElectionDetailTotals[];
  units: InsightsElectionDetailUnits[];
}
