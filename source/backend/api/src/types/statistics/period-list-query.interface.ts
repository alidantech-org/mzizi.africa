
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Granularity } from "#/types/statistics/granularity.enum.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Period List Query */
export interface PeriodListQuery {
  granularity?: Granularity;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
}