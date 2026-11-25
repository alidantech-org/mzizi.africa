/** The bytes as obtained, through a filesystem version. */
export interface SourceArtifacts {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  editionId?: string | null;
  id: string;
  parentId?: string | null;
  updatedAt: string;
  version: number;
  versionId: string;
}
