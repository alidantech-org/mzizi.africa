
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record. */
export interface Citations {
  captureId?: Id | null;
  createdAt: Instant;
  deletedAt?: Instant | null;
  documentId?: Id | null;
  evidenceId: Id;
  fileVersionId: Id;
  id: Id;
  locator: JsonText;
  locatorKindId: Id;
  quotedHash?: Sha256 | null;
  recordedAt: Instant;
  updatedAt: Instant;
  version: PositiveInteger;
}