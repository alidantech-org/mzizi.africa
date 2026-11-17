/** Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record. */
export interface SourceCitations {
  captureId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  documentId?: string | null;
  evidenceId: string;
  fileVersionId: string;
  id: string;
  locator: string;
  locatorKindId: string;
  quotedHash?: string | null;
  recordedAt: string;
  updatedAt: string;
  version: number;
}
