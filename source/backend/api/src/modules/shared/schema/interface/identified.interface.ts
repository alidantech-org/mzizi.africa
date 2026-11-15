import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Base for operational records: identity only. */
export interface Identified {
  id: Id;
}
