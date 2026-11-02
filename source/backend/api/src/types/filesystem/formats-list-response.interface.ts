
import type { FormatPublic } from "#/types/filesystem/format-public.interface.ts";
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";

/** Formats List Response */
export interface FormatsListResponse {
  formats: FormatPublic[];
  meta: PaginationMeta;
}