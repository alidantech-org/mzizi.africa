
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

/** Institution Window */
export interface InstitutionWindow {
  codePrefix?: IdentityCode;
  limit?: Integer;
  offset?: Integer;
}