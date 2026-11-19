import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Content List Input */
export interface ContentListInput {
  category?: string;
  languageCode?: string;
  limit?: number;
  query?: string;
  tag?: string;
}

/** Field metadata for forms and results. */
export const ContentListInputFields: readonly FieldMeta[] = [
  { name: "category", label: "Category", kind: "string", required: false },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: false,
  },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "query", label: "Query", kind: "string", required: false },
  { name: "tag", label: "Tag", kind: "string", required: false },
];
