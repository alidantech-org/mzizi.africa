
import type { PartyMembershipPublic } from "#/types/political/party-membership-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Party Memberships List Response */
export interface PartyMembershipsListResponse {
  memberships: PartyMembershipPublic[];
  meta: PaginationMeta;
}