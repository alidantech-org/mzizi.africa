
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Indicator Category List Query */
export interface IndicatorCategoryListQuery {
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  parentId?: Id;
  sort?: SortDirection;
}