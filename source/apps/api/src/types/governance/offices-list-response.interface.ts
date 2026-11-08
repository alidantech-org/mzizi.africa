
import type { OfficePublic } from "#/types/governance/office-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Offices List Response */
export interface OfficesListResponse {
  meta: PaginationMeta;
  offices: OfficePublic[];
}