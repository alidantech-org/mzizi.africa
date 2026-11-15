
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/** Found Member */
export interface FoundMember {
  code: IdentityCode;
  id: Id;
  label: Name;
  scheme: IdentityCode;
}