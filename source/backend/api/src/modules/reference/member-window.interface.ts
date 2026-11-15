
import type { Id } from "#/modules/shared/id.type.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

/** Member Window */
export interface MemberWindow {
  limit?: Integer;
  offset?: Integer;
  schemeId: Id;
}