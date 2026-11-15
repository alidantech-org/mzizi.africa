
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/** Base for versioned records: id, version, created/updated timestamps and soft delete. */
export interface Entity {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}