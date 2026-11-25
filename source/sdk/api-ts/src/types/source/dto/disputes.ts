import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";

/** Conflicting claims about one row. */
export interface SourceDisputes {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kindTerm: string;
  note?: string | null;
  noteLanguageId?: string | null;
  resolutionId?: string | null;
  resolvedOn?: string | null;
  statusTerm: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  updatedAt: string;
  version: number;
}
