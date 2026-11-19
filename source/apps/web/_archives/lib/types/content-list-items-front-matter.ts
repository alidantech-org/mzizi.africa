import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Content List Items Front Matter */
export interface ContentListItemsFrontMatter {
  image?: string;
}

/** Field metadata for forms and results. */
export const ContentListItemsFrontMatterFields: readonly FieldMeta[] = [
  { name: "image", label: "Image", kind: "string", required: false },
];
