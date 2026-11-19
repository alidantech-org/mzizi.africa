import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type ContentListCategories } from "#/lib/types/content-list-categories.ts";
import { type ContentListItems } from "#/lib/types/content-list-items.ts";

/** Content List */
export interface ContentList {
  categories: ContentListCategories[];
  gaps: string[];
  items: ContentListItems[];
}

/** Field metadata for forms and results. */
export const ContentListFields: readonly FieldMeta[] = [
  { name: "categories", label: "Categories", kind: "other", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "items", label: "Items", kind: "other", required: true },
];
