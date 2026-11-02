
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteFamilyPublic } from "#/types/website/site-family-public.interface.ts";

/** Site Families List Response */
export interface SiteFamiliesListResponse {
  families: SiteFamilyPublic[];
  meta: PaginationMeta;
}