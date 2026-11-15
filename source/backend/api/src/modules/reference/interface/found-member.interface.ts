
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/** Found Member */
export interface FoundMember {
  code: IdentityCode;
  id: Id;
  label: Name;
  scheme: IdentityCode;
}