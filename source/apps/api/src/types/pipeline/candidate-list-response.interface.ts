
import type { CandidateSummary } from "#/types/pipeline/candidate-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Candidate List Response */
export interface CandidateListResponse {
  candidates: CandidateSummary[];
  meta: PaginationMeta;
}