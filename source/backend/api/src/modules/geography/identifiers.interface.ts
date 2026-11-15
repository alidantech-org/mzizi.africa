
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** A preserved identifier assigned to a feature by an external geographic registry or source system. */
export interface Identifiers {
  createdAt: Instant;
  deletedAt?: Instant | null;
  externalId: NonEmptyString500;
  featureId: Id;
  id: Id;
  identifierSchemeId: Id;
  namespace?: NonEmptyString255 | null;
  sourceRefId?: Id | null;
  updatedAt: Instant;
  version: PositiveInteger;
}