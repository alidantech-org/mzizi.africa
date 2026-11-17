
import type { CodedEntity } from './coded-entity';
import type { Scheme } from './scheme';

/** A controlled classification member within one scheme, with optional supersession and an optional broader parent value in the same scheme. Wider, cross-scheme or many-parent links use value relations. */
export interface Value {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  label: string;
  parentId?: string | null;
  schemeId: string;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}