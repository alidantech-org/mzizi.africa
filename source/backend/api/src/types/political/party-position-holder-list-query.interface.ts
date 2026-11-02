
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Party Position Holder List Query */
export interface PartyPositionHolderListQuery {
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  personId?: Id;
  positionId?: Id;
  sort?: SortDirection;
}