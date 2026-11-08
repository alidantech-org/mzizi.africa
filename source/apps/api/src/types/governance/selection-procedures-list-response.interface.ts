
import type { SelectionProcedurePublic } from "#/types/governance/selection-procedure-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Selection Procedures List Response */
export interface SelectionProceduresListResponse {
  meta: PaginationMeta;
  procedures: SelectionProcedurePublic[];
}