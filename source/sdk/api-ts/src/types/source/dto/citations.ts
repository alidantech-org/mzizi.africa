/** Exactly where in an artifact or capture a fact is. */
export interface SourceCitations {
  artifactId?: string | null;
  captureId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  locator: string;
  locatorTerm: string;
  pathId?: string | null;
  quotedHash?: string | null;
  recordedAt: string;
  retrievedAt?: string | null;
  updatedAt: string;
  version: number;
}
