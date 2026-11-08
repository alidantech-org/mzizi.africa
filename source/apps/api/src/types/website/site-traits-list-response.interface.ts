
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteTraitPublic } from "#/types/website/site-trait-public.interface.ts";

/** Site Traits List Response */
export interface SiteTraitsListResponse {
  meta: PaginationMeta;
  siteTraits: SiteTraitPublic[];
}