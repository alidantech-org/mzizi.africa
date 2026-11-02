
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { VintagePublic } from "#/types/statistics/vintage-public.interface.ts";

/** Vintages List Response */
export interface VintagesListResponse {
  meta: PaginationMeta;
  vintages: VintagePublic[];
}