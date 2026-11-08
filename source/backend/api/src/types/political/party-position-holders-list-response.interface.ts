
import type { PartyPositionHolderPublic } from "#/types/political/party-position-holder-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Party Position Holders List Response */
export interface PartyPositionHoldersListResponse {
  holders: PartyPositionHolderPublic[];
  meta: PaginationMeta;
}