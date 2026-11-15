
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

/** Unit Window */
export interface UnitWindow {
  codePrefix?: IdentityCode;
  countryId?: Id;
  limit?: Integer;
  offset?: Integer;
}