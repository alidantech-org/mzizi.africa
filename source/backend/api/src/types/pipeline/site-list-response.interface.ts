
import type { SiteSummary } from "#/types/pipeline/site-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Site List Response */
export interface SiteListResponse {
  meta: PaginationMeta;
  sites: SiteSummary[];
}