
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SitePublisherPublic } from "#/types/website/site-publisher-public.interface.ts";

/** Site Publishers List Response */
export interface SitePublishersListResponse {
  meta: PaginationMeta;
  sitePublishers: SitePublisherPublic[];
}