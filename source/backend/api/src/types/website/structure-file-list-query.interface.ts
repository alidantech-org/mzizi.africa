
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { StructureFileRole } from "#/types/website/structure-file-role.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Structure File List Query */
export interface StructureFileListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  order?: SortDirection;
  page?: PaginationNumber;
  role?: StructureFileRole;
  sort?: SortDirection;
  versionId?: Id;
}