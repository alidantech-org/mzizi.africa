
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { SiteRelationKind } from "#/types/website/site-relation-kind.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Site Relation List Query */
export interface SiteRelationListQuery {
  fromId?: Id;
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  relation?: SiteRelationKind;
  sort?: SortDirection;
  toId?: Id;
}