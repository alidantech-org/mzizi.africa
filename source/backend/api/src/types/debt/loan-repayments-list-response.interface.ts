
import type { LoanRepaymentPublic } from "#/types/debt/loan-repayment-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Loan Repayments List Response */
export interface LoanRepaymentsListResponse {
  meta: PaginationMeta;
  repayments: LoanRepaymentPublic[];
}