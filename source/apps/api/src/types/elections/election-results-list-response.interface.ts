
import type { ElectionResultPublic } from "#/types/elections/election-result-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Election Results List Response */
export interface ElectionResultsListResponse {
  meta: PaginationMeta;
  results: ElectionResultPublic[];
}