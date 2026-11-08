
import type { EntityOwnershipPublic } from "#/types/entities/entity-ownership-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Entity Ownerships List Response */
export interface EntityOwnershipsListResponse {
  meta: PaginationMeta;
  ownerships: EntityOwnershipPublic[];
}