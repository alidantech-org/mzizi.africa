
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { DimensionPublic } from "#/types/statistics/dimension-public.interface.ts";

/** Dimensions List Response */
export interface DimensionsListResponse {
  dimensions: DimensionPublic[];
  meta: PaginationMeta;
}