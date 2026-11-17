
import type { ValidityEntity } from './validity-entity';

/** Base for versioned records valid over a period whose start and end may be uncertain. */
export interface HistoricalValidityEntity {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validFromEarliest?: string | null;
  validFromLatest?: string | null;
  validUntil?: string | null;
  validUntilEarliest?: string | null;
  validUntilLatest?: string | null;
  version: number;
}