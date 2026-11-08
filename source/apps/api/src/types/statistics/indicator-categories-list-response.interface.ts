
import type { PaginatedResponse } from "#/types/shared/paginated-response.interface.ts";
import type { PaginationMeta } from "#/types/shared/pagination-meta.interface.ts";
import type { IndicatorCategoryPublic } from "#/types/statistics/indicator-category-public.interface.ts";

/** Indicator Categories List Response */
export interface IndicatorCategoriesListResponse {
  categories: IndicatorCategoryPublic[];
  meta: PaginationMeta;
}