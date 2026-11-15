import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Found Member */
export interface FoundMember {
  code: IdentityCode;
  id: Id;
  label: Name;
  scheme: IdentityCode;
}
