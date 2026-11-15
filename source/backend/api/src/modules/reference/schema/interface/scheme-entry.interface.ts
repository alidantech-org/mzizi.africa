
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Scheme Entry */
export interface SchemeEntry {
  code: IdentityCode;
  id: Id;
  title: Name;
}