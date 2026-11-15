
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict. */
export interface PublicationReceipts {
  actorSnapshot: JsonText;
  contractVersion: NonEmptyString255;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  idempotencyKey: NonEmptyString255;
  payloadHash: Sha256;
  publicationRefId: Id;
  publishedAt: Instant;
  requestHash: Sha256;
  resultManifest: JsonText;
  updatedAt: Instant;
  version: PositiveInteger;
}