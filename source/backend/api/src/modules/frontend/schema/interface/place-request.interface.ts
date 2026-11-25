import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Place Request */
export interface PlaceRequest {
  country: IdentityCode;
  lang?: IdentityCode;
  place?: IdentityCode;
}
