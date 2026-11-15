
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Institution Detail Offices */
export interface InstitutionDetailOffices {
  code: IdentityCode;
  id: Id;
  kind: IdentityCode;
}