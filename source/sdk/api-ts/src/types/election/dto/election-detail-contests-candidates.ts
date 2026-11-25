import type { ElectionElectionDetailContestsCandidatesNames } from "#sdk/types/election/dto/election-detail-contests-candidates-names.ts";

/** Election Detail Contests Candidates */
export interface ElectionElectionDetailContestsCandidates {
  ballotOrder: number | null;
  candidateId: string;
  individualId: string;
  names: ElectionElectionDetailContestsCandidatesNames[];
  partyCode: string | null;
  partyId: string | null;
}
