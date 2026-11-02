
import type { AmenityPublic } from "#/types/services/amenity-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Amenities List Response */
export interface AmenitiesListResponse {
  amenities: AmenityPublic[];
  meta: PaginationMeta;
}