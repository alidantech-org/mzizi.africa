
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/** Scheme Window */
export interface SchemeWindow {
  code?: IdentityCode;
  limit?: Integer;
  offset?: Integer;
}