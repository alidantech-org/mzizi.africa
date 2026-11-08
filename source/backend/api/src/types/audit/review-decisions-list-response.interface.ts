
import type { ReviewDecisionPublic } from "#/types/audit/review-decision-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Review Decisions List Response */
export interface ReviewDecisionsListResponse {
  decisions: ReviewDecisionPublic[];
  meta: PaginationMeta;
}