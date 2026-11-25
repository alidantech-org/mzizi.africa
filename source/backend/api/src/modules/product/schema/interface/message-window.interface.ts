import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Message Window */
export interface MessageWindow {
  appCode: IdentityCode;
  lang: IdentityCode;
  limit?: Integer;
  offset?: Integer;
}
