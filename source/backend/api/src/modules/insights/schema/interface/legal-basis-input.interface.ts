import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Legal Basis Input */
export interface LegalBasisInput {
  subjectCode: Code;
  subjectTable: NonEmptyString100;
}
