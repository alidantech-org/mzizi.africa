import type { StructureStructureDocumentFunctionsAssignments } from "#sdk/types/structure/dto/structure-document-functions-assignments.ts";

/** Structure Document Functions */
export interface StructureStructureDocumentFunctions {
  assignments: StructureStructureDocumentFunctionsAssignments[];
  citationId: string | null;
  code: string;
  id: string;
  parentId: string | null;
}
