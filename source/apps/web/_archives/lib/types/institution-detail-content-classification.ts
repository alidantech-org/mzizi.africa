import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution Detail Content Classification */
export interface InstitutionDetailContentClassification {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailContentClassificationFields: readonly FieldMeta[] =
  [
    { name: "code", label: "Code", kind: "string", required: true },
    { name: "label", label: "Label", kind: "string", required: true },
  ];
