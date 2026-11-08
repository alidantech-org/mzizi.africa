
import type { TenderPublic } from "#/types/procurement/tender-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Tenders List Response */
export interface TendersListResponse {
  meta: PaginationMeta;
  tenders: TenderPublic[];
}