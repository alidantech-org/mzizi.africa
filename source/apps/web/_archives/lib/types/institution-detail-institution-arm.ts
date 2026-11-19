import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution Detail Institution Arm */
export interface InstitutionDetailInstitutionArm {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailInstitutionArmFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
