
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for association rows: id, created timestamp and soft delete. */
export interface Association {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
}