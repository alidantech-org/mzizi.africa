
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { StructurePublic } from "#/types/website/structure-public.interface.ts";

/** Structures List Response */
export interface StructuresListResponse {
  meta: PaginationMeta;
  structures: StructurePublic[];
}