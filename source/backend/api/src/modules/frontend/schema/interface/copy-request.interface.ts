import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Copy Request */
export interface CopyRequest {
  app: IdentityCode;
  lang?: IdentityCode;
}
