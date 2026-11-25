import { FilesystemAccess } from "#sdk/types/filesystem/enums/access.ts";

/** Immutable exact bytes in object storage, with hash, size and access. */
export interface FilesystemVersions {
  access: FilesystemAccess;
  contentType: string;
  createdAt: string;
  createdBySnapshot: string;
  deletedAt?: string | null;
  fileId: string;
  formatId?: string | null;
  id: string;
  originalFilename?: string | null;
  pinned: boolean;
  provenance: string;
  revision: number;
  s3Key: string;
  sha256: string;
  sizeBytes: number;
  updatedAt: string;
  verifiedAt: string;
  version: number;
}
