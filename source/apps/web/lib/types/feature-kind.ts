import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Feature Kind */
export interface FeatureKind {
  code: string;
  id: string;
  label: string;
}

/** Field metadata for forms and results. */
export const FeatureKindFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
