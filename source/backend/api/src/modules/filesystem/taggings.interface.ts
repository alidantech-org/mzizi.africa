
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One tag assignment to exactly one typed file or folder target. */
export interface Taggings {
  createdAt: Instant;
  deletedAt?: Instant | null;
  fileId?: Id | null;
  folderId?: Id | null;
  id: Id;
  tagId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}