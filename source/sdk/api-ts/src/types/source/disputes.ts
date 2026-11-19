import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** A recorded disagreement between sources about one record. Both claims are kept with their citations and shown side by side; nothing is overwritten. */
export interface SourceDisputes {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  kindId: string;
  resolutionCitationId?: string | null;
  resolvedOn?: string | null;
  statusId: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  summary: string;
  updatedAt: string;
  version: number;
}
