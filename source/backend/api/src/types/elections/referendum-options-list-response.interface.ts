
import type { ReferendumOptionPublic } from "#/types/elections/referendum-option-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Referendum Options List Response */
export interface ReferendumOptionsListResponse {
  meta: PaginationMeta;
  options: ReferendumOptionPublic[];
}