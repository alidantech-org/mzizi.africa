import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Content List Items Classification */
export interface ContentListItemsClassification {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const ContentListItemsClassificationFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
