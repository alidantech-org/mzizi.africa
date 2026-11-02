
import type { ExpenditurePublic } from "#/types/finance/expenditure-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Expenditures List Response */
export interface ExpendituresListResponse {
  expenditures: ExpenditurePublic[];
  meta: PaginationMeta;
}