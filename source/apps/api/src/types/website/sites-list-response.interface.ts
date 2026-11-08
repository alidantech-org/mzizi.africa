
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SitePublic } from "#/types/website/site-public.interface.ts";

/** Sites List Response */
export interface SitesListResponse {
  meta: PaginationMeta;
  sites: SitePublic[];
}