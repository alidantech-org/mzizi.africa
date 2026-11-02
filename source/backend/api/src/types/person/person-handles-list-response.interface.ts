
import type { PersonHandlePublic } from "#/types/person/person-handle-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Person Handles List Response */
export interface PersonHandlesListResponse {
  handles: PersonHandlePublic[];
  meta: PaginationMeta;
}