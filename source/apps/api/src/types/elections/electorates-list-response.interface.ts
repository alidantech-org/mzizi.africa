
import type { ElectoratePublic } from "#/types/elections/electorate-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Electorates List Response */
export interface ElectoratesListResponse {
  electorates: ElectoratePublic[];
  meta: PaginationMeta;
}