/** Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp. */
export interface SourceCitations {
  artifactId: string;
  captureId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  locator: string;
  locatorKindId: string;
  quotedHash?: string | null;
  recordedAt: string;
  relationshipId?: string | null;
  updatedAt: string;
  version: number;
}
