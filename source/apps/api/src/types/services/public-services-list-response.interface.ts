
import type { PublicServicePublic } from "#/types/services/public-service-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Public Services List Response */
export interface PublicServicesListResponse {
  meta: PaginationMeta;
  services: PublicServicePublic[];
}