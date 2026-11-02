
import type { JobSummary } from "#/types/pipeline/job-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Job List Response */
export interface JobListResponse {
  jobs: JobSummary[];
  meta: PaginationMeta;
}