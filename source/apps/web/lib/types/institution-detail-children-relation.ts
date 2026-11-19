import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Institution Detail Children Relation */
export interface InstitutionDetailChildrenRelation {
  code: string;
  label: string;
}

/** Field metadata for forms and results. */
export const InstitutionDetailChildrenRelationFields: readonly FieldMeta[] = [
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "label", label: "Label", kind: "string", required: true },
];
