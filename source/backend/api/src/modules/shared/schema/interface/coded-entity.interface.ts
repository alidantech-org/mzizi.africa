
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for versioned records with a unique identity code. */
export interface CodedEntity {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}