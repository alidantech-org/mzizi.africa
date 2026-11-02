
import type { ElectionPublic } from "#/types/elections/election-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Elections List Response */
export interface ElectionsListResponse {
  elections: ElectionPublic[];
  meta: PaginationMeta;
}