
import type { LegalProvisionPublic } from "#/types/legal/legal-provision-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Legal Provisions List Response */
export interface LegalProvisionsListResponse {
  meta: PaginationMeta;
  provisions: LegalProvisionPublic[];
}