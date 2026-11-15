
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Stable published document identity; repeated captures retain independent retrieval history. */
export interface Documents {
  canonicalUrl?: Url | null;
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  kindId: Id;
  publishedOn?: CalendarDate | null;
  publisherId: Id;
  sourceId: Id;
  title: Name;
  updatedAt: Instant;
  version: PositiveInteger;
}