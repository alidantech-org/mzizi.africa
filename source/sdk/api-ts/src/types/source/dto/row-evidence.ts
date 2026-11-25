import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** Row Evidence */
export interface SourceRowEvidence {
  limit?: number;
  offset?: number;
  subjectId: string;
  subjectTable: SharedSubjectTable;
}
