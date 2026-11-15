
import type { Id } from "#/modules/shared/id.type.ts";

/** Base for operational records: identity only. */
export interface Identified {
  id: Id;
}