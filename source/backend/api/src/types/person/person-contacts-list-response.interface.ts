
import type { PersonContactPublic } from "#/types/person/person-contact-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Person Contacts List Response */
export interface PersonContactsListResponse {
  contacts: PersonContactPublic[];
  meta: PaginationMeta;
}