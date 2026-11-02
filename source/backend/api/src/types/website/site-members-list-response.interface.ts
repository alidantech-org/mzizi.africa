
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { SiteMemberPublic } from "#/types/website/site-member-public.interface.ts";

/** Site Members List Response */
export interface SiteMembersListResponse {
  meta: PaginationMeta;
  siteMembers: SiteMemberPublic[];
}