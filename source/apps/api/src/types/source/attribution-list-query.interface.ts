
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { AttributionRelation } from "#/types/source/attribution-relation.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Attribution List Query */
export interface AttributionListQuery {
  documentId?: Id;
  includeHistory?: Flag;
  limit?: PaginationNumber;
  methodId?: Id;
  order?: SortDirection;
  page?: PaginationNumber;
  relation?: AttributionRelation;
  sort?: SortDirection;
  targetId?: Id;
  targetKind?: TargetKind;
}