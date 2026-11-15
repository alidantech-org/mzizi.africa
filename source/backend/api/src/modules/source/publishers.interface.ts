
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Accepted publisher; an optional official identity distinguishes organization from publication channel. */
export interface Publishers {
  code: IdentityCode;
  countryId?: Id | null;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  kindId: Id;
  name: Name;
  officialEntityId?: Id | null;
  updatedAt: Instant;
  version: PositiveInteger;
}