
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";

/** Base for operational records with a unique identity code. */
export interface CodedIdentified {
  code: IdentityCode;
  id: Id;
}