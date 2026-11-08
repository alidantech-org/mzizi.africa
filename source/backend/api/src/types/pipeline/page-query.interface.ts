
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Page Query */
export interface PageQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
}