
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { CapturePublic } from "#/types/source/capture-public.interface.ts";

/** Captures List Response */
export interface CapturesListResponse {
  captures: CapturePublic[];
  meta: PaginationMeta;
}