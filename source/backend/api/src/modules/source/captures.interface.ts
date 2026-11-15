
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations. */
export interface Captures {
  contentHash: Sha256;
  createdAt: Instant;
  deletedAt?: Instant | null;
  documentId?: Id | null;
  fileVersionId: Id;
  id: Id;
  manifestReleaseId?: Id | null;
  responseMetadata: JsonText;
  retrievedAt: Instant;
  retrievedUrl: Url;
  sourceId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}