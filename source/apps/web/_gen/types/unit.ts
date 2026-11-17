
import type { CodedEntity } from './coded-entity';

/** Measurement unit and conversion to its optional base unit; never a spatial unit. */
export interface Unit {
  baseId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  offset: number;
  quantity: string;
  scale: number;
  symbol: string;
  updatedAt: string;
  version: number;
}