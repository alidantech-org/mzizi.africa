import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Parents Relation */
export interface InstitutionDetailParentsRelation {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailParentsRelationFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
