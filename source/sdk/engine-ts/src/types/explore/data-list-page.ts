import type { ExploreDataList } from "#sdk/types/explore/data-list.ts";

/** Data List Page */
export interface ExploreDataListPage {
  definition: ExploreDataList;
  limit: number;
  offset: number;
  rows: unknown[];
  total: number;
}
