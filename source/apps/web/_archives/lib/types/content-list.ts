import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ContentListCategories } from "#/_archives/lib/types/content-list-categories";
import { type ContentListItems } from "#/_archives/lib/types/content-list-items";

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
