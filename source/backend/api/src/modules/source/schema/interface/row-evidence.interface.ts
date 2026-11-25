import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Row Evidence */
export interface RowEvidence {
  limit?: Integer;
  offset?: Integer;
  subjectId: Id;
  subjectTable: SubjectTable;
}
