
import type { Factor } from "#/modules/reference/factor.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Measurement unit and conversion to its optional base unit; never a spatial unit. */
export interface Unit {
  baseId?: Id | null;
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  offset: Factor;
  quantity: NonEmptyString255;
  scale: Factor;
  symbol: NonEmptyString100;
  updatedAt: Instant;
  version: PositiveInteger;
}