
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** API channel with named credential binding only; request behavior is pinned in manifest releases. */
export interface Apis {
  baseUrl: Url;
  createdAt: Instant;
  credentialBinding?: NonEmptyString255 | null;
  deletedAt?: Instant | null;
  id: Id;
  sourceId: Id;
  updatedAt: Instant;
  version: PositiveInteger;
}