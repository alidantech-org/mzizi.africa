
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";

/** Base Query */
export interface BaseQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
}