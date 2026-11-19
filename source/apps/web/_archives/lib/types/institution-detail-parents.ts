import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type InstitutionDetailParentsRelation } from "#/_archives/lib/types/institution-detail-parents-relation";

/** Institution Detail Parents */
export interface InstitutionDetailParents {
  children: number;
  code: string;
  name: string;
  relation: InstitutionDetailParentsRelation;
}

/** Field metadata for forms and results. */
export const InstitutionDetailParentsFields: readonly FieldMeta[] = [
  { name: "children", label: "Children", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "relation", label: "Relation", kind: "other", required: true },
];
