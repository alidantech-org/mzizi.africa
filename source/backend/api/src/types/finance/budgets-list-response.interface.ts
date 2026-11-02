
import type { BudgetPublic } from "#/types/finance/budget-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Budgets List Response */
export interface BudgetsListResponse {
  budgets: BudgetPublic[];
  meta: PaginationMeta;
}