
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/** Member Entry */
export interface MemberEntry {
  code: IdentityCode;
  id: Id;
  label: Name;
  supersedesId: Id | null;
}