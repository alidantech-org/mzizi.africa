
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";

/** Scheme Entry */
export interface SchemeEntry {
  code: IdentityCode;
  id: Id;
  title: Name;
}