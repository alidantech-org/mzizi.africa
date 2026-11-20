import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** Base for versioned, coded records about one subject row, with a period of integer years. */
export interface SharedCodedPeriodSubjectEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
