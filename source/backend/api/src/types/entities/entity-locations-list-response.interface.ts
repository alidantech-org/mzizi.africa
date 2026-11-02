
import type { EntityLocationPublic } from "#/types/entities/entity-location-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Entity Locations List Response */
export interface EntityLocationsListResponse {
  locations: EntityLocationPublic[];
  meta: PaginationMeta;
}