
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for operational records: identity and creation time. */
export interface Created {
  createdAt: Instant;
  id: Id;
}