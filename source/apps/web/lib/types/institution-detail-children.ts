import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type InstitutionDetailChildrenRelation } from "#/lib/types/institution-detail-children-relation.ts";

/** Institution Detail Children */
export interface InstitutionDetailChildren {
  children: number;
  code: string;
  name: string;
  relation: InstitutionDetailChildrenRelation;
}

/** Field metadata for forms and results. */
export const InstitutionDetailChildrenFields: readonly FieldMeta[] = [
  { name: "children", label: "Children", kind: "number", required: true },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "relation", label: "Relation", kind: "other", required: true },
];
