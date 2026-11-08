
import type { SelectionStagePublic } from "#/types/governance/selection-stage-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Selection Stages List Response */
export interface SelectionStagesListResponse {
  meta: PaginationMeta;
  stages: SelectionStagePublic[];
}