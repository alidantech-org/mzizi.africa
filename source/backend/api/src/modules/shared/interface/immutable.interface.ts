
import type { Id } from "#/modules/shared/type/id.type.ts";

/** Base for append-only operational records: identity written once. */
export interface Immutable {
  id: Id;
}