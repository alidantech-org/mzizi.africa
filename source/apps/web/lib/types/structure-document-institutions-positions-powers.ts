import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Structure Document Institutions Positions Powers */
export interface StructureDocumentInstitutionsPositionsPowers {
  binding: boolean;
  citationId: string | null;
  code: string;
  id: string;
  kind: string;
  procedureId: string | null;
  step: number | null;
  targetInstitutionId: string | null;
  targetPositionId: string | null;
}

/** Field metadata for forms and results. */
export const StructureDocumentInstitutionsPositionsPowersFields: readonly FieldMeta[] = [
  { name: "binding", label: "Binding", kind: "boolean", required: true },
  { name: "citationId", label: "Citation Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "procedureId", label: "Procedure Id", kind: "string", required: false },
  { name: "step", label: "Step", kind: "number", required: false },
  { name: "targetInstitutionId", label: "Target Institution Id", kind: "string", required: false },
  { name: "targetPositionId", label: "Target Position Id", kind: "string", required: false },
];
