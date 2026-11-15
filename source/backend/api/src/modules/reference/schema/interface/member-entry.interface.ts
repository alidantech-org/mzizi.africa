
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Member Entry */
export interface MemberEntry {
  code: IdentityCode;
  id: Id;
  label: Name;
  supersedesId: Id | null;
}