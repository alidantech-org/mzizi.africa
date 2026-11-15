
import type { Id } from "#/modules/shared/id.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Website-specific identity attached to a source channel. */
export interface Websites {
  canonicalUrl: Url;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  sourceId: Id;
  title: Name;
  updatedAt: Instant;
  version: PositiveInteger;
}