import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution Detail Leaders How */
export interface InstitutionDetailLeadersHow {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailLeadersHowFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
