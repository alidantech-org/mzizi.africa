
import type { Access } from "#/modules/filesystem/access.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Logical hierarchy; access escalation requires recorded authorization, independent of object keys. */
export interface Folders {
  access: Access;
  authorization?: JsonText | null;
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  name: Name;
  parentId?: Id | null;
  roleId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}