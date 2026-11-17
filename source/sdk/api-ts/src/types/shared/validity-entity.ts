/** Base for versioned records valid over an optional period. */
export interface SharedValidityEntity {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
