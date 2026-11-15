
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Directed exact input-to-output lineage with a pinned processing description; originals remain immutable. */
export interface FileRelations {
  createdAt: Instant;
  deletedAt?: Instant | null;
  derivedVersionId: Id;
  id: Id;
  kindId: Id;
  processingProvenance: JsonText;
  sourceVersionId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}