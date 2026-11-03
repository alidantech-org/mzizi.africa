
import type { ReferendumResultPublic } from "#/types/elections/referendum-result-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Referendum Results List Response */
export interface ReferendumResultsListResponse {
  meta: PaginationMeta;
  referendumResults: ReferendumResultPublic[];
}