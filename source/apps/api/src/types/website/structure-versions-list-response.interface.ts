
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { StructureVersionPublic } from "#/types/website/structure-version-public.interface.ts";

/** Structure Versions List Response */
export interface StructureVersionsListResponse {
  meta: PaginationMeta;
  structureVersions: StructureVersionPublic[];
}