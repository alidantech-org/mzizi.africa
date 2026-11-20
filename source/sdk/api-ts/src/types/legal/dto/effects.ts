import { LegalReviewStatus } from "#sdk/types/legal/enums/review-status.ts";
import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** A reviewed assertion of what a wording establishes, governs, limits or changes for one subject record. Never mutates the subject. */
export interface LegalEffects {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  endedOn?: string | null;
  explanation?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  kindId: string;
  observedAt: string;
  reviewStatus: LegalReviewStatus;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  toYear?: number | null;
  updatedAt: string;
  version: number;
  wordingId: string;
}
