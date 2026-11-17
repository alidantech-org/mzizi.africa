
import type { CodedEntity } from './coded-entity';

/** Stable identity for a reusable, reviewed pattern definition. */
export interface Pattern {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  title: string;
  updatedAt: string;
  version: number;
}