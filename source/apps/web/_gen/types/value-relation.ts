
import { ValueRelationKind } from './enums/value-relation-kind';
import type { Association } from './association';
import type { Value } from './value';

/** A directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind. */
export interface ValueRelation {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  relationKind: ValueRelationKind;
  sourceValueId: string;
  targetValueId: string;
  validFrom?: string | null;
  validUntil?: string | null;
}