import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** A dated relation between two slugs that name the same thing or the same area: translations, aliases, a constituency and a sub-county covering the same land. Must not form cycles. */
export interface SourceLinks {
  createdAt: string;
  deletedAt?: string | null;
  fromSlugId: string;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  relationKindId: string;
  toSlugId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
