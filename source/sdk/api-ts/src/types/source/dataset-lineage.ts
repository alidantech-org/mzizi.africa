import { SourceLineageRole } from "#sdk/types/enums/source/lineage-role.ts";

/** What a dataset was prepared from: a capture, a document or another dataset, with the role and method. */
export interface SourceDatasetLineage {
  createdAt: string;
  datasetId: string;
  deletedAt?: string | null;
  id: string;
  inputCaptureId?: string | null;
  inputDatasetId?: string | null;
  inputDocumentId?: string | null;
  method?: string | null;
  role: SourceLineageRole;
  updatedAt: string;
  version: number;
}
