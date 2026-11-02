
import type { CaptureSummary } from "#/types/pipeline/capture-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Capture List Response */
export interface CaptureListResponse {
  captures: CaptureSummary[];
  meta: PaginationMeta;
}