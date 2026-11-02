
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteRelationPublic } from "#/types/website/site-relation-public.interface.ts";

/** Site Relations List Response */
export interface SiteRelationsListResponse {
  meta: PaginationMeta;
  siteRelations: SiteRelationPublic[];
}