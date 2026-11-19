import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type StructureDocumentFunctionsAssignments } from "#/lib/types/structure-document-functions-assignments.ts";

/** Structure Document Functions */
export interface StructureDocumentFunctions {
  assignments: StructureDocumentFunctionsAssignments[];
  citationId: string | null;
  code: string;
  id: string;
  parentId: string | null;
}

/** Field metadata for forms and results. */
export const StructureDocumentFunctionsFields: readonly FieldMeta[] = [
  { name: "assignments", label: "Assignments", kind: "other", required: true },
  { name: "citationId", label: "Citation Id", kind: "string", required: false },
  { name: "code", label: "Code", kind: "string", required: true },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "parentId", label: "Parent Id", kind: "string", required: false },
];
