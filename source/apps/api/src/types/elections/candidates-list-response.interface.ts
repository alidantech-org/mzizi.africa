
import type { CandidatePublic } from "#/types/elections/candidate-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Candidates List Response */
export interface CandidatesListResponse {
  candidates: CandidatePublic[];
  meta: PaginationMeta;
}