
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { IndicatorColumnPublic } from "#/types/statistics/indicator-column-public.interface.ts";

/** Indicator Columns List Response */
export interface IndicatorColumnsListResponse {
  columns: IndicatorColumnPublic[];
  meta: PaginationMeta;
}