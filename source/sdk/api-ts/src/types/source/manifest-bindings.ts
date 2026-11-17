/** Dated release binding; activation never changes releases already pinned by running jobs. */
export interface SourceManifestBindings {
  activatedAt: string;
  createdAt: string;
  deactivatedAt?: string | null;
  deletedAt?: string | null;
  effectiveFrom: string;
  effectiveUntil?: string | null;
  id: string;
  manifestReleaseId: string;
  sourceId: string;
  updatedAt: string;
  version: number;
}
