
import type { LegalAmendmentPublic } from "#/types/legal/legal-amendment-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Legal Amendments List Response */
export interface LegalAmendmentsListResponse {
  amendments: LegalAmendmentPublic[];
  meta: PaginationMeta;
}