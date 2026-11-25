import type { Host } from "#/modules/frontend/schema/type/host.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Home Request */
export interface HomeRequest {
  host?: Host;
  lang?: IdentityCode;
}
