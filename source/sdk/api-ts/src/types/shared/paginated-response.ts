import type { SharedPaginationMeta } from "#sdk/types/shared/pagination-meta.ts";

/** Paginated Response */
export interface SharedPaginatedResponse {
  meta: SharedPaginationMeta;
}
