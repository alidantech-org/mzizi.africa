
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { StatisticsTablePublic } from "#/types/statistics/statistics-table-public.interface.ts";

/** Statistics Tables List Response */
export interface StatisticsTablesListResponse {
  meta: PaginationMeta;
  tables: StatisticsTablePublic[];
}