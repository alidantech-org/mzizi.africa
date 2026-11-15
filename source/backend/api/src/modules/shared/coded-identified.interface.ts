
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";

/** Base for operational records with a unique identity code. */
export interface CodedIdentified {
  code: IdentityCode;
  id: Id;
}