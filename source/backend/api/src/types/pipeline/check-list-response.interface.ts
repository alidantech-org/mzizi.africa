
import type { CheckSummary } from "#/types/pipeline/check-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Check List Response */
export interface CheckListResponse {
  checks: CheckSummary[];
  meta: PaginationMeta;
}