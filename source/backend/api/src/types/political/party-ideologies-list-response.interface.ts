
import type { PartyIdeologyPublic } from "#/types/political/party-ideology-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Party Ideologies List Response */
export interface PartyIdeologiesListResponse {
  meta: PaginationMeta;
  partyIdeologies: PartyIdeologyPublic[];
}