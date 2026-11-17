/** Base for versioned records with a unique identity code and an optional validity period. */
export interface SharedCodedValidityEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
