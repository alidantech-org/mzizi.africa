
import type { PartyUnitPublic } from "#/types/political/party-unit-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Party Units List Response */
export interface PartyUnitsListResponse {
  meta: PaginationMeta;
  units: PartyUnitPublic[];
}