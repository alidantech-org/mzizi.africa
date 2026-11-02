
import type { LegalAmendmentChangePublic } from "#/types/legal/legal-amendment-change-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Legal Amendment Changes List Response */
export interface LegalAmendmentChangesListResponse {
  changes: LegalAmendmentChangePublic[];
  meta: PaginationMeta;
}