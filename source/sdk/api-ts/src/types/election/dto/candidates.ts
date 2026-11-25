/** A person standing in a contest. */
export interface ElectionCandidates {
  ballotOrder?: number | null;
  code: string;
  contestId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  individualId: string;
  kindTerm: string;
  partyId?: string | null;
  updatedAt: string;
  version: number;
}
