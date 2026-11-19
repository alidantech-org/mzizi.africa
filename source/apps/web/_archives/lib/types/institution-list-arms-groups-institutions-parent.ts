import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Institution List Arms Groups Institutions Parent */
export interface InstitutionListArmsGroupsInstitutionsParent {
  code: string;
  name: string;
}

/** Field metadata for forms and results. */
export const InstitutionListArmsGroupsInstitutionsParentFields: readonly FieldMeta[] =
  [
    { name: "code", label: "Code", kind: "string", required: true },
    { name: "name", label: "Name", kind: "string", required: true },
  ];
