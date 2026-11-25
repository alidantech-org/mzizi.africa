import type { ElectionElectionDetailContestsCandidates } from "#sdk/types/election/dto/election-detail-contests-candidates.ts";

/** Election Detail Contests */
export interface ElectionElectionDetailContests {
  candidates: ElectionElectionDetailContestsCandidates[];
  code: string;
  contestId: string;
  featureId: string | null;
  kindTerm: string;
  officeId: string | null;
}
