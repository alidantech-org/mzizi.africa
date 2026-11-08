
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteDomainPublic } from "#/types/website/site-domain-public.interface.ts";

/** Site Domains List Response */
export interface SiteDomainsListResponse {
  domains: SiteDomainPublic[];
  meta: PaginationMeta;
}