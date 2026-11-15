import type { PaginationMeta } from "#/modules/shared/schema/interface/pagination-meta.interface.ts";

/** Paginated Response */
export interface PaginatedResponse {
  meta: PaginationMeta;
}
