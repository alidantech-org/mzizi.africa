
import type { AmenityOfficePublic } from "#/types/services/amenity-office-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Amenity Offices List Response */
export interface AmenityOfficesListResponse {
  amenityOffices: AmenityOfficePublic[];
  meta: PaginationMeta;
}