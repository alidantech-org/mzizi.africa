import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Unit Window */
export interface UnitWindow {
  codePrefix?: IdentityCode;
  countryId?: Id;
  limit?: Integer;
  offset?: Integer;
}
