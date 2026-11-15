
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Pagination Meta */
export interface PaginationMeta {
  limit: NonNegativeInteger;
  page: NonNegativeInteger;
  total: NonNegativeInteger;
  totalPages: NonNegativeInteger;
}