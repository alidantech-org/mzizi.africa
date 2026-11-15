
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/** Scheme Entry */
export interface SchemeEntry {
  code: IdentityCode;
  id: Id;
  title: Name;
}