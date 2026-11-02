
import type { BidPublic } from "#/types/procurement/bid-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Bids List Response */
export interface BidsListResponse {
  bids: BidPublic[];
  meta: PaginationMeta;
}