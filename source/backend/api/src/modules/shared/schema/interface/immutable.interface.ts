
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Base for append-only operational records: identity written once. */
export interface Immutable {
  id: Id;
}