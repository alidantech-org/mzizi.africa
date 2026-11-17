
import type { Entity } from './entity';
import type { Features } from './features';
import type { Value } from './value';

/** An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities. */
export interface Changes {
  changeKindId: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  explanation?: string | null;
  id: string;
  predecessorFeatureId?: string | null;
  successorFeatureId?: string | null;
  transformationId: string;
  updatedAt: string;
  version: number;
}