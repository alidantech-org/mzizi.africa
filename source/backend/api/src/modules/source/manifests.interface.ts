
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Stable API, website or extraction configuration identity; contents remain versioned artifacts. */
export interface Manifests {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  description?: Description | null;
  id: Id;
  kindId: Id;
  title: Name;
  updatedAt: Instant;
  version: PositiveInteger;
}