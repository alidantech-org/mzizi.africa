import type { ElectionElectionDetailContests } from "#sdk/types/election/dto/election-detail-contests.ts";
import type { ElectionElectionDetailNames } from "#sdk/types/election/dto/election-detail-names.ts";

/** Election Detail */
export interface ElectionElectionDetail {
  code: string;
  contests: ElectionElectionDetailContests[];
  electionId: string;
  fromYear: number;
  heldOn: string | null;
  kindTerm: string;
  names: ElectionElectionDetailNames[];
  statusTerm: string;
}
