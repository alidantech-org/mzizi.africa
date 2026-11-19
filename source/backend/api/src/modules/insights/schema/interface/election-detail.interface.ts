import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { ElectionDetailContests } from "#/modules/insights/schema/interface/election-detail-contests.interface.ts";
import type { ElectionDetailElection } from "#/modules/insights/schema/interface/election-detail-election.interface.ts";
import type { ElectionDetailTotals } from "#/modules/insights/schema/interface/election-detail-totals.interface.ts";
import type { ElectionDetailUnits } from "#/modules/insights/schema/interface/election-detail-units.interface.ts";

/** Election Detail */
export interface ElectionDetail {
  contests: ElectionDetailContests[];
  election: ElectionDetailElection;
  gaps: NonEmptyString500[];
  totals: ElectionDetailTotals[];
  units: ElectionDetailUnits[];
}
