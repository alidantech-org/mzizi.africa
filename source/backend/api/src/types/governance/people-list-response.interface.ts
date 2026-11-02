
import type { PersonPublic } from "#/types/governance/person-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** People List Response */
export interface PeopleListResponse {
  meta: PaginationMeta;
  people: PersonPublic[];
}