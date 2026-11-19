import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content List Items Front Matter */
export interface ContentListItemsFrontMatter {
  image?: string;
}

/** Field metadata for forms and results. */
export const ContentListItemsFrontMatterFields: readonly FieldMeta[] = [
  { name: "image", label: "Image", kind: "string", required: false },
];
