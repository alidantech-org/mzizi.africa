
import type { CodedEntity } from './coded-entity';

/** Stable identity and stewardship snapshot for a controlled vocabulary scheme. */
export interface Scheme {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  ownerSnapshot: string;
  title: string;
  updatedAt: string;
  version: number;
}