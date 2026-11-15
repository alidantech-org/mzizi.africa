import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for operational records: identity, creation time and last-change time. */
export interface Timestamped {
  createdAt: Instant;
  id: Id;
  updatedAt: Instant;
}
