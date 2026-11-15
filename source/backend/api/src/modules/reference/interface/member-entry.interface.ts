
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/** Member Entry */
export interface MemberEntry {
  code: IdentityCode;
  id: Id;
  label: Name;
  supersedesId: Id | null;
}