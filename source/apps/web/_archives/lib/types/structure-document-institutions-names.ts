import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Structure Document Institutions Names */
export interface StructureDocumentInstitutionsNames {
  name: string;
  preferred: boolean;
}

/** Field metadata for forms and results. */
export const StructureDocumentInstitutionsNamesFields: readonly FieldMeta[] = [
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "preferred", label: "Preferred", kind: "boolean", required: true },
];
