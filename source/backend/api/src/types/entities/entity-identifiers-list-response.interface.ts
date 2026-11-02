
import type { EntityIdentifierPublic } from "#/types/entities/entity-identifier-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Entity Identifiers List Response */
export interface EntityIdentifiersListResponse {
  identifiers: EntityIdentifierPublic[];
  meta: PaginationMeta;
}