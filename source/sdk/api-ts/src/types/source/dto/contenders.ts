/** One side of a dispute. */
export interface SourceContenders {
  claim: string;
  createdAt: string;
  deletedAt?: string | null;
  disputeId: string;
  evidenceId: string;
  id: string;
  isPreferred: boolean;
  languageId: string;
  updatedAt: string;
  version: number;
}
