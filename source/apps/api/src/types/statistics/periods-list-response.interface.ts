
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { PeriodPublic } from "#/types/statistics/period-public.interface.ts";

/** Periods List Response */
export interface PeriodsListResponse {
  meta: PaginationMeta;
  periods: PeriodPublic[];
}