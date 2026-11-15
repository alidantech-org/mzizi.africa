
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Dated release binding; activation never changes releases already pinned by running jobs. */
export interface ManifestBindings {
  activatedAt: Instant;
  createdAt: Instant;
  deactivatedAt?: Instant | null;
  deletedAt?: Instant | null;
  effectiveFrom: Instant;
  effectiveUntil?: Instant | null;
  id: Id;
  manifestReleaseId: Id;
  sourceId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}