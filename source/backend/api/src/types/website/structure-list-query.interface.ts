
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { StructureOwnerKind } from "#/types/website/structure-owner-kind.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Structure List Query */
export interface StructureListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  ownerId?: Id;
  ownerKind?: StructureOwnerKind;
  page?: PaginationNumber;
  sort?: SortDirection;
}