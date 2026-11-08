
import type { SortDirection } from "#/types/shared/sort-direction.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { PaginationNumber } from "#/types/shared/pagination-number.type.ts";
import type { BaseQuery } from "#/types/shared/base-query.interface.ts";

/** Manifesto Commitment List Query */
export interface ManifestoCommitmentListQuery {
  includeHistory?: Flag;
  limit?: PaginationNumber;
  manifestoId?: Id;
  order?: SortDirection;
  page?: PaginationNumber;
  parentId?: Id;
  sort?: SortDirection;
}