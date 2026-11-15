
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/** Base for operational records: identity and creation time. */
export interface Created {
  createdAt: Instant;
  id: Id;
}