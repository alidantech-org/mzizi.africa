import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content List Categories */
export interface ContentListCategories {
  code: string;
  count: number;
  label: string;
}

/** Field metadata for forms and results. */
export const ContentListCategoriesFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
