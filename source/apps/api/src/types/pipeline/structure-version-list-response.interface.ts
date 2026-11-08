
import type { StructureVersionSummary } from "#/types/pipeline/structure-version-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Structure Version List Response */
export interface StructureVersionListResponse {
  meta: PaginationMeta;
  structureVersions: StructureVersionSummary[];
}