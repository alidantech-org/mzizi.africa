
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/** Pagination Meta */
export interface PaginationMeta {
  limit: PaginationNumber;
  page: PaginationNumber;
  total: PaginationNumber;
  totalPages: PaginationNumber;
}