import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Term Window */
export interface TermWindow {
  limit?: Integer;
  offset?: Integer;
  schemeId: Id;
}
