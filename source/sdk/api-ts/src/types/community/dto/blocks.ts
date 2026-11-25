/** A block on an account that posted bad content; a blocked account cannot sign in or contribute. */
export interface CommunityBlocks {
  accountId: string;
  caseId?: string | null;
  createdAt: string;
  decidedBy: string;
  deletedAt?: string | null;
  fromOn: string;
  id: string;
  reasonTerm: string;
  toOn?: string | null;
  updatedAt: string;
  version: number;
}
