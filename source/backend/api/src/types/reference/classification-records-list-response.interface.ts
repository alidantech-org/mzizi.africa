
import type { ClassificationRecordPublic } from "#/types/reference/classification-record-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Classification Records List Response */
export interface ClassificationRecordsListResponse {
  meta: PaginationMeta;
  records: ClassificationRecordPublic[];
}