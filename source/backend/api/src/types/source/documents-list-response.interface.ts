
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { DocumentPublic } from "#/types/source/document-public.interface.ts";

/** Documents List Response */
export interface DocumentsListResponse {
  documents: DocumentPublic[];
  meta: PaginationMeta;
}