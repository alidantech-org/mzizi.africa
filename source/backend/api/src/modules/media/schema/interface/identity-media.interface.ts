import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Identity Media */
export interface IdentityMedia {
  identityId: Id;
  limit?: Integer;
  offset?: Integer;
}
