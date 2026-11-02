
import type { ProvisionKind } from "#/types/legal/provision-kind.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Legal Provision List Query */
export interface LegalProvisionListQuery {
  instrumentId?: Id;
  kind?: ProvisionKind;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  parentId?: Id;
  q?: Name;
  sort?: SortDirection;
}