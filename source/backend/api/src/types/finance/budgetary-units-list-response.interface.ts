
import type { BudgetaryUnitPublic } from "#/types/finance/budgetary-unit-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Budgetary Units List Response */
export interface BudgetaryUnitsListResponse {
  meta: PaginationMeta;
  units: BudgetaryUnitPublic[];
}