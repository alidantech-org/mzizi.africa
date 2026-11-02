
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { IndicatorPublic } from "#/types/statistics/indicator-public.interface.ts";

/** Indicators List Response */
export interface IndicatorsListResponse {
  indicators: IndicatorPublic[];
  meta: PaginationMeta;
}