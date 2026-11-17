
import type { CodedHistoricalEntity } from './coded-historical-entity';
import type { Value } from './value';

/** The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here. */
export interface Features {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  featureTypeId: string;
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