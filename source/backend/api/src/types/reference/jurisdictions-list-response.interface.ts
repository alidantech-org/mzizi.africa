
import type { JurisdictionPublic } from "#/types/reference/jurisdiction-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Jurisdictions List Response */
export interface JurisdictionsListResponse {
  jurisdictions: JurisdictionPublic[];
  meta: PaginationMeta;
}