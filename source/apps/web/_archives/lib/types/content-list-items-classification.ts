import type { FieldMeta } from "#/_archives/lib/dryv/transport";

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
