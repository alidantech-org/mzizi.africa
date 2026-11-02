
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { AttributionPublic } from "#/types/source/attribution-public.interface.ts";

/** Attributions List Response */
export interface AttributionsListResponse {
  attributions: AttributionPublic[];
  meta: PaginationMeta;
}