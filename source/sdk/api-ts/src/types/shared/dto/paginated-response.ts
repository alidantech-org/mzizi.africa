import type { SharedPaginationMeta } from "#sdk/types/shared/dto/pagination-meta.ts";

/** Paginated Response */
export interface SharedPaginatedResponse {
  meta: SharedPaginationMeta;
}
