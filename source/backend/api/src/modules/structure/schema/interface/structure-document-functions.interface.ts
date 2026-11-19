import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { StructureDocumentFunctionsAssignments } from "#/modules/structure/schema/interface/structure-document-functions-assignments.interface.ts";

/** Structure Document Functions */
export interface StructureDocumentFunctions {
  assignments: StructureDocumentFunctionsAssignments[];
  citationId: Id | null;
  code: IdentityCode;
  id: Id;
  parentId: Id | null;
}
