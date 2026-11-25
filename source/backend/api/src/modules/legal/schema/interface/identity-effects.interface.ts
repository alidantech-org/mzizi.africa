import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Identity Effects */
export interface IdentityEffects {
  identityId: Id;
  limit?: Integer;
  offset?: Integer;
}
