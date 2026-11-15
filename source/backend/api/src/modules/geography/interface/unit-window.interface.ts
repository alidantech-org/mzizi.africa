
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/** Unit Window */
export interface UnitWindow {
  codePrefix?: IdentityCode;
  countryId?: Id;
  limit?: Integer;
  offset?: Integer;
}