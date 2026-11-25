/** A political donation or in-kind contribution as disclosed. */
export interface PoliticsContributions {
  amount?: number | null;
  code: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  donorId: string;
  electionId?: string | null;
  givenOn?: string | null;
  id: string;
  isInKind: boolean;
  recipientId: string;
  statusTerm: string;
  updatedAt: string;
  version: number;
  versionId?: string | null;
}
