
import type { Access } from "#/modules/filesystem/access.enum.ts";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/non-empty-string500.type.ts";
import type { NonNegativeInt64 } from "#/modules/shared/non-negative-int64.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance. */
export interface FileVersions {
  access: Access;
  contentType: NonEmptyString255;
  createdAt: Instant;
  createdBySnapshot: JsonText;
  deletedAt?: Instant | null;
  fileExtensionId?: Id | null;
  fileId: Id;
  id: Id;
  originalFilename?: NonEmptyString500 | null;
  pinned: Flag;
  provenance: JsonText;
  revision: PositiveInteger;
  s3Key: NonEmptyString1000;
  sha256: Sha256;
  sizeBytes: NonNegativeInt64;
  updatedAt: Instant;
  verifiedAt: Instant;
  version: PositiveInteger;
}