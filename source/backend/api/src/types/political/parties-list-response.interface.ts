
import type { PartyPublic } from "#/types/political/party-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Parties List Response */
export interface PartiesListResponse {
  meta: PaginationMeta;
  parties: PartyPublic[];
}