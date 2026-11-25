import type { SubjectCode } from "#/modules/community/schema/type/subject-code.type.ts";
import type { Visitor } from "#/modules/community/schema/type/visitor.type.ts";

/** View Input */
export interface ViewInput {
  subjectCode: SubjectCode;
  visitor: Visitor;
}
