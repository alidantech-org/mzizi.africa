import type { InsightsSearchHit } from "#sdk/types/insights/search-hit.ts";

/** Search Results */
export interface InsightsSearchResults {
  counts: unknown;
  hits: InsightsSearchHit[];
  query: string;
  total: number;
}
