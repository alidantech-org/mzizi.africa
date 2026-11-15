
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/** Base for operational records: identity, creation time and last-change time. */
export interface Timestamped {
  createdAt: Instant;
  id: Id;
  updatedAt: Instant;
}