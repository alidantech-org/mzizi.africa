
import type { LoanPublic } from "#/types/debt/loan-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Loans List Response */
export interface LoansListResponse {
  loans: LoanPublic[];
  meta: PaginationMeta;
}