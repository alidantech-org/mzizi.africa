
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { ObservationPublic } from "#/types/statistics/observation-public.interface.ts";

/** Observations List Response */
export interface ObservationsListResponse {
  meta: PaginationMeta;
  observations: ObservationPublic[];
}