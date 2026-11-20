import { FilesystemAccess } from "#sdk/types/filesystem/enums/access.ts";

/** Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance. */
export interface FilesystemFileVersions {
  access: FilesystemAccess;
  contentType: string;
  createdAt: string;
  createdBySnapshot: string;
  deletedAt?: string | null;
  fileExtensionId?: string | null;
  fileId: string;
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
