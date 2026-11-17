import { SourceReleaseStatus } from "#sdk/types/enums/source/release-status.ts";

/** Pinned approved manifest content; schema and capabilities are immutable release inputs. */
export interface SourceManifestReleases {
  approvedAt: string;
  approvedBySnapshot: string;
  contentHash: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveFrom: string;
  effectiveUntil?: string | null;
  fileVersionId: string;
  id: string;
  inputSchemaCode: string;
  inputSchemaVersion: string;
  manifestId: string;
  releaseLabel: string;
  requiredCapabilities: string;
  status: SourceReleaseStatus;
  updatedAt: string;
  version: number;
}
