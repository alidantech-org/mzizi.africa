
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";

/** Institution Detail Offices */
export interface InstitutionDetailOffices {
  code: IdentityCode;
  id: Id;
  kind: IdentityCode;
}