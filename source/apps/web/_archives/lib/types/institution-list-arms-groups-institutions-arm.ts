import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution List Arms Groups Institutions Arm */
export interface InstitutionListArmsGroupsInstitutionsArm {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsInstitutionsArmFields: readonly FieldMeta[] =
  [
    { name: "code", label: "Code", kind: "string", required: true },
    { name: "label", label: "Label", kind: "string", required: true },
  ];
