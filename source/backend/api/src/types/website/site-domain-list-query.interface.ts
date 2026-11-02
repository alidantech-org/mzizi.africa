
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { DomainRole } from "#/types/website/domain-role.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Site Domain List Query */
export interface SiteDomainListQuery {
  hostname?: Hostname;
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  role?: DomainRole;
  siteId?: Id;
  sort?: SortDirection;
}