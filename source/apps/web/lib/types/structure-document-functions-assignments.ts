import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Structure Document Functions Assignments */
export interface StructureDocumentFunctionsAssignments {
  citationId: string | null;
  id: string;
  institutionId: string | null;
  share: string;
  startInstitutionId: string | null;
  startPositionId: string | null;
}

/** Field metadata for forms and results. */
export const StructureDocumentFunctionsAssignmentsFields: readonly FieldMeta[] = [
  { name: "citationId", label: "Citation Id", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "institutionId", label: "Institution Id", kind: "string", required: false },
  { name: "share", label: "Share", kind: "string", required: true },
  { name: "startInstitutionId", label: "Start Institution Id", kind: "string", required: false },
  { name: "startPositionId", label: "Start Position Id", kind: "string", required: false },
];
