import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship. */
export interface SourceRelationships {
  createdAt: string;
  deletedAt?: string | null;
  executionRef?: string | null;
  id: string;
  inputArtifactId?: string | null;
  inputCaptureId?: string | null;
  inputEditionId?: string | null;
  inputFileVersionId?: string | null;
  inputProductId?: string | null;
  kindId: string;
  method?: string | null;
  outputArtifactId?: string | null;
  outputCaptureId?: string | null;
  outputEditionId?: string | null;
  outputFileVersionId?: string | null;
  outputProductId?: string | null;
  subjectId?: string | null;
  subjectTable?: SharedSubjectTable | null;
  updatedAt: string;
  version: number;
}
