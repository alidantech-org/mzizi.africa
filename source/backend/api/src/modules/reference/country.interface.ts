
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Canonical identity for a modern country; not a geographic unit or historical polity. */
export interface Country {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  name: Name;
  updatedAt: Instant;
  version: PositiveInteger;
}