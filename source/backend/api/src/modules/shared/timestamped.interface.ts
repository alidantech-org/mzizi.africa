
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Base for operational records: identity, creation time and last-change time. */
export interface Timestamped {
  createdAt: Instant;
  id: Id;
  updatedAt: Instant;
}