
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Base for operational records with a unique identity code. */
export interface CodedIdentified {
  code: IdentityCode;
  id: Id;
}