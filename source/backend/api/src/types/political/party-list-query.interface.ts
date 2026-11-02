
import type { PartyStatus } from "#/types/political/party-status.enum.ts";
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Party List Query */
export interface PartyListQuery {
  includeHistory?: Flag;
  jurisdictionId?: Id;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  q?: Name;
  sort?: SortDirection;
  status?: PartyStatus;
}