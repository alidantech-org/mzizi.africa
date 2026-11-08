
import type { FolderPublic } from "#/types/filesystem/folder-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Folders List Response */
export interface FoldersListResponse {
  folders: FolderPublic[];
  meta: PaginationMeta;
}