
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { VersionStatus } from "#/types/website/version-status.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Structure Version List Query */
export interface StructureVersionListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  sort?: SortDirection;
  status?: VersionStatus;
  structureId?: Id;
}