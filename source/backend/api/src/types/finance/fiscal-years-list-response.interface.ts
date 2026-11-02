
import type { FiscalYearPublic } from "#/types/finance/fiscal-year-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Fiscal Years List Response */
export interface FiscalYearsListResponse {
  fiscalYears: FiscalYearPublic[];
  meta: PaginationMeta;
}