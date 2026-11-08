
import type { RevenueRecordPublic } from "#/types/finance/revenue-record-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Revenue Records List Response */
export interface RevenueRecordsListResponse {
  meta: PaginationMeta;
  revenues: RevenueRecordPublic[];
}