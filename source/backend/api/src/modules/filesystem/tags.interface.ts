
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One shared tag catalogue for files and folders. */
export interface Tags {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  description?: Description | null;
  id: Id;
  title: Name;
  updatedAt: Instant;
  version: PositiveInteger;
}