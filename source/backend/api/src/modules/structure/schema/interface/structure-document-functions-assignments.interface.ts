import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Structure Document Functions Assignments */
export interface StructureDocumentFunctionsAssignments {
  citationId: Id | null;
  id: Id;
  institutionId: Id | null;
  share: Name;
  startInstitutionId: Id | null;
  startPositionId: Id | null;
}
