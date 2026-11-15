import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Scheme Window */
export interface SchemeWindow {
  code?: IdentityCode;
  limit?: Integer;
  offset?: Integer;
}
