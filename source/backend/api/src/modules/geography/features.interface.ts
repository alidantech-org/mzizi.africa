
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** The sole canonical identity for each geographic entity, independent of type, country or geometry. */
export interface Features {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  featureTypeId: Id;
  id: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}