import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content Page Content Category */
export interface ContentPageContentCategory {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const ContentPageContentCategoryFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
