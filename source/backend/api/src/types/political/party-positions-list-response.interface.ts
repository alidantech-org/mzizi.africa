
import type { PartyPositionPublic } from "#/types/political/party-position-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Party Positions List Response */
export interface PartyPositionsListResponse {
  meta: PaginationMeta;
  positions: PartyPositionPublic[];
}