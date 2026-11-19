/** One side of a dispute: a citation and the claim it supports. */
export interface SourceContenders {
  citationId: string;
  claim: string;
  createdAt: string;
  deletedAt?: string | null;
  disputeId: string;
  id: string;
  isPreferred: boolean;
  position?: number | null;
  updatedAt: string;
  version: number;
}
