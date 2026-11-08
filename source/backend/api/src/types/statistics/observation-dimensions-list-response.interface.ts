
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { ObservationDimensionPublic } from "#/types/statistics/observation-dimension-public.interface.ts";

/** Observation Dimensions List Response */
export interface ObservationDimensionsListResponse {
  meta: PaginationMeta;
  observationDimensions: ObservationDimensionPublic[];
}