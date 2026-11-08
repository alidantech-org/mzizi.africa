
import type { LoanDisbursementPublic } from "#/types/debt/loan-disbursement-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Loan Disbursements List Response */
export interface LoanDisbursementsListResponse {
  disbursements: LoanDisbursementPublic[];
  meta: PaginationMeta;
}