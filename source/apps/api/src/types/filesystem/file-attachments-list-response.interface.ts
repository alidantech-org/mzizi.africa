
import type { FileAttachmentPublic } from "#/types/filesystem/file-attachment-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** File Attachments List Response */
export interface FileAttachmentsListResponse {
  attachments: FileAttachmentPublic[];
  meta: PaginationMeta;
}