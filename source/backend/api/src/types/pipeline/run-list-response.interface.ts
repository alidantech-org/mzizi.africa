
import type { RunSummary } from "#/types/pipeline/run-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Run List Response */
export interface RunListResponse {
  meta: PaginationMeta;
  runs: RunSummary[];
}