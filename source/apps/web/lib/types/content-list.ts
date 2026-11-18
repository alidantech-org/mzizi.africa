import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content List */
export interface ContentList {
  categories: unknown[];
  gaps: string[];
  items: unknown[];
}

/** Field metadata for forms and results. */
export const ContentListFields: readonly FieldMeta[] = [
  { name: "categories", label: "Categories", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "items", label: "Items", kind: "other", required: true },
];
