
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/** Member Window */
export interface MemberWindow {
  limit?: Integer;
  offset?: Integer;
  schemeId: Id;
}