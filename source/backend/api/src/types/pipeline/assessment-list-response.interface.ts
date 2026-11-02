
import type { AssessmentSummary } from "#/types/pipeline/assessment-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Assessment List Response */
export interface AssessmentListResponse {
  assessments: AssessmentSummary[];
  meta: PaginationMeta;
}