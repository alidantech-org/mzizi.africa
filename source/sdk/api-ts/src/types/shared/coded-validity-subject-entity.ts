import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** Base for versioned, coded records about one subject row, valid over an optional period. */
export interface SharedCodedValiditySubjectEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
