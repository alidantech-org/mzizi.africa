import { SharedSubjectTable } from "#sdk/types/shared/enums/subject-table.ts";
import { SourceEvidenceMethod } from "#sdk/types/source/enums/evidence-method.ts";
import { SourceEvidenceRole } from "#sdk/types/source/enums/evidence-role.ts";

/** The provenance linking table: which citation supports, or contradicts, which row. No foreign key on the subject by design; soft-deleted rows keep their evidence. */
export interface SourceEvidence {
  citationId: string;
  confidence?: number | null;
  createdAt: string;
  fields?: string[] | null;
  id: string;
  method: SourceEvidenceMethod;
  observedAt?: string | null;
  recordedAt: string;
  role: SourceEvidenceRole;
  subjectId: string;
  subjectTable: SharedSubjectTable;
}
