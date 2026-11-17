import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** Base for versioned, coded records about one subject row. */
export interface SharedCodedSubjectEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  updatedAt: string;
  version: number;
}
