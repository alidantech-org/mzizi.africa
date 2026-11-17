import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp. */
export interface SourceCitations {
  addressId?: string | null;
  artifactId?: string | null;
  captureId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  locator: string;
  locatorKindId: string;
  quotedHash?: string | null;
  recordedAt: string;
  subjectId?: string | null;
  subjectTable?: SharedSubjectTable | null;
  updatedAt: string;
  version: number;
}
