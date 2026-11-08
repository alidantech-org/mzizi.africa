
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { DimensionMemberPublic } from "#/types/statistics/dimension-member-public.interface.ts";

/** Dimension Members List Response */
export interface DimensionMembersListResponse {
  members: DimensionMemberPublic[];
  meta: PaginationMeta;
}