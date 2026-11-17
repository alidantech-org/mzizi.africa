import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Search Input */
export interface SearchInput {
  languageCode?: string;
  limit?: number;
  query: string;
}

/** Field metadata for forms and results. */
export const SearchInputFields: readonly FieldMeta[] = [
  { name: "languageCode", label: "Language Code", kind: "string", required: false },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "query", label: "Query", kind: "string", required: true },
];
