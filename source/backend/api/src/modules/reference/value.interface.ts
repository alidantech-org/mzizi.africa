
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** A controlled classification member within one scheme, with optional supersession. */
export interface Value {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  label: Name;
  schemeId: Id;
  supersedesId?: Id | null;
  updatedAt: Instant;
  version: PositiveInteger;
}