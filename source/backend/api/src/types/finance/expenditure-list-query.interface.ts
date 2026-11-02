
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Expenditure List Query */
export interface ExpenditureListQuery {
  budgetId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
  stageId?: Id;
  unitId?: Id;
}