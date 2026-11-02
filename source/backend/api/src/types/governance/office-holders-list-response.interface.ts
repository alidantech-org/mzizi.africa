
import type { OfficeHolderPublic } from "#/types/governance/office-holder-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Office Holders List Response */
export interface OfficeHoldersListResponse {
  holders: OfficeHolderPublic[];
  meta: PaginationMeta;
}