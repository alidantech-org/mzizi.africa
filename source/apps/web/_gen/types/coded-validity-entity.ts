
import type { ValidityEntity } from './validity-entity';

/** Base for versioned records with a unique identity code and an optional validity period. */
export interface CodedValidityEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}