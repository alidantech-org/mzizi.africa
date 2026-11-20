import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** Base for a record about one subject: the subject's fully qualified table and its row id. Contributes no other fields. */
export interface SharedSubjectReference {
  subjectId: string;
  subjectTable: SharedSubjectTable;
}
