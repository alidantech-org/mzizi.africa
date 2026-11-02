
import type { FilePublic } from "#/types/filesystem/file-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Files List Response */
export interface FilesListResponse {
  files: FilePublic[];
  meta: PaginationMeta;
}