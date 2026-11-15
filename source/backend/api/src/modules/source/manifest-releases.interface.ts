
import type { ReleaseStatus } from "#/modules/source/release-status.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Pinned approved manifest content; schema and capabilities are immutable release inputs. */
export interface ManifestReleases {
  approvedAt: Instant;
  approvedBySnapshot: JsonText;
  contentHash: Sha256;
  createdAt: Instant;
  deletedAt?: Instant | null;
  effectiveFrom: Instant;
  effectiveUntil?: Instant | null;
  fileVersionId: Id;
  id: Id;
  inputSchemaCode: IdentityCode;
  inputSchemaVersion: NonEmptyString100;
  manifestId: Id;
  releaseLabel: NonEmptyString100;
  requiredCapabilities: JsonText;
  status: ReleaseStatus;
  updatedAt: Instant;
  version: PositiveInteger;
}