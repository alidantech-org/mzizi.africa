import type { ExploreColumnInfo } from "#sdk/types/explore/column-info.ts";

/** Table Page */
export interface ExploreTablePage {
  columns: ExploreColumnInfo[];
  direction: string;
  domain: string;
  limit: number;
  offset: number;
  order: string;
  rows: unknown[];
  search: string;
  table: string;
  total: number;
}
