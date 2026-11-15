
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/** Institution Window */
export interface InstitutionWindow {
  codePrefix?: IdentityCode;
  limit?: Integer;
  offset?: Integer;
}