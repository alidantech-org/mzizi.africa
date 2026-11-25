import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Institution Request */
export interface InstitutionRequest {
  country: IdentityCode;
  institution: IdentityCode;
  lang?: IdentityCode;
}
