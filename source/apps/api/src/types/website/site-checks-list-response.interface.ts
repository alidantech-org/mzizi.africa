
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteCheckPublic } from "#/types/website/site-check-public.interface.ts";

/** Site Checks List Response */
export interface SiteChecksListResponse {
  meta: PaginationMeta;
  siteChecks: SiteCheckPublic[];
}