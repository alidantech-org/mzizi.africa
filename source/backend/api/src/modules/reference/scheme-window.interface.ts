
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

/** Scheme Window */
export interface SchemeWindow {
  code?: IdentityCode;
  limit?: Integer;
  offset?: Integer;
}