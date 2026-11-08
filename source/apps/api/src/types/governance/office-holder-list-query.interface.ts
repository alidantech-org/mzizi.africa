
import type { HolderStatus } from "#/types/governance/holder-status.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Office Holder List Query */
export interface OfficeHolderListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  officeId?: Id;
  order?: SortDirection;
  page?: PaginationNumber;
  personId?: Id;
  sort?: SortDirection;
  status?: HolderStatus;
}