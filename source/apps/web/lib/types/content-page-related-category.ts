import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content Page Related Category */
export interface ContentPageRelatedCategory {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const ContentPageRelatedCategoryFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
