/** Directed exact input-to-output lineage with a pinned processing description; originals remain immutable. */
export interface FilesystemFileRelations {
  createdAt: string;
  deletedAt?: string | null;
  derivedVersionId: string;
  id: string;
  kindId: string;
  processingProvenance: string;
  sourceVersionId: string;
  updatedAt: string;
  version: number;
}
