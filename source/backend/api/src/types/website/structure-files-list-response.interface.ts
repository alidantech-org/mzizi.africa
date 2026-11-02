
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { StructureFilePublic } from "#/types/website/structure-file-public.interface.ts";

/** Structure Files List Response */
export interface StructureFilesListResponse {
  meta: PaginationMeta;
  structureFiles: StructureFilePublic[];
}