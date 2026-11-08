
import type { PersonProfilePublic } from "#/types/person/person-profile-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Person Profiles List Response */
export interface PersonProfilesListResponse {
  meta: PaginationMeta;
  profiles: PersonProfilePublic[];
}