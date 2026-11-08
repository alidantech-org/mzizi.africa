
import type { DocumentSummary } from "#/types/pipeline/document-summary.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Document List Response */
export interface DocumentListResponse {
  documents: DocumentSummary[];
  meta: PaginationMeta;
}