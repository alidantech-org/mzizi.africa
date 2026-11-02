
import type { PersonNamePublic } from "#/types/person/person-name-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Person Names List Response */
export interface PersonNamesListResponse {
  meta: PaginationMeta;
  personNames: PersonNamePublic[];
}