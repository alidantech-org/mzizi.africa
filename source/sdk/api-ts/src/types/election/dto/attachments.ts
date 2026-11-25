/** Media on elections, contests and candidates (a debate video). */
export interface ElectionAttachments {
  articleId?: string | null;
  assetId?: string | null;
  candidateId?: string | null;
  contestId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  electionId?: string | null;
  endSecond?: number | null;
  id: string;
  position?: number | null;
  purposeTerm: string;
  startSecond?: number | null;
  updatedAt: string;
  version: number;
}
