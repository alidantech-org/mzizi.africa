
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Base for operational records: identity and creation time. */
export interface Created {
  createdAt: Instant;
  id: Id;
}