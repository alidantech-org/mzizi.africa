import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type SearchHit } from "#/_archives/lib/types/search-hit";

/** Search Results */
export interface SearchResults {
  counts: unknown;
  hits: SearchHit[];
  query: string;
  total: number;
}

/** Field metadata for forms and results. */
export const SearchResultsFields: readonly FieldMeta[] = [
  { name: "counts", label: "Counts", kind: "other", required: true },
  { name: "hits", label: "Hits", kind: "other", required: true },
  { name: "query", label: "Query", kind: "string", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
];
