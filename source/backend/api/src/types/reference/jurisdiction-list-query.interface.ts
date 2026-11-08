
import type { JurisdictionKind } from "#/types/reference/jurisdiction-kind.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Jurisdiction List Query */
export interface JurisdictionListQuery {
  includeHistory?: Flag;
  kind?: JurisdictionKind;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  q?: Name;
  sort?: SortDirection;
}