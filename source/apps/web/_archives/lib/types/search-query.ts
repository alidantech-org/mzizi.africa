import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Search Query */
export interface SearchQuery {
  kinds?: string;
  languageCode?: string;
  limit?: number;
  query: string;
}

/** Field metadata for forms and results. */
export const SearchQueryFields: readonly FieldMeta[] = [
  { name: "kinds", label: "Kinds", kind: "string", required: false },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "query", label: "Query", kind: "string", required: true },
];
