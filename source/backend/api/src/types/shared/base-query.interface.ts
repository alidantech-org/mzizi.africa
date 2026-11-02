
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/** Base Query */
export interface BaseQuery {
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
}