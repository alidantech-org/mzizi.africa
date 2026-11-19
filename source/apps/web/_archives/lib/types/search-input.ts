import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Search Input */
export interface SearchInput {
  languageCode?: string;
  limit?: number;
  query: string;
}

/** Field metadata for forms and results. */
export const SearchInputFields: readonly FieldMeta[] = [
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "query", label: "Query", kind: "string", required: true },
];
