
import type { FileVersionPublic } from "#/types/filesystem/file-version-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** File Versions List Response */
export interface FileVersionsListResponse {
  meta: PaginationMeta;
  versions: FileVersionPublic[];
}