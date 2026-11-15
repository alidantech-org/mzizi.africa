
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Base for association rows: id, created timestamp and soft delete. */
export interface Association {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
}