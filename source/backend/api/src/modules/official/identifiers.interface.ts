
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer. */
export interface Identifiers {
  createdAt: Instant;
  deletedAt?: Instant | null;
  entityId?: Id | null;
  id: Id;
  individualId?: Id | null;
  issuerEntityId?: Id | null;
  namespace?: NonEmptyString255 | null;
  schemeId: Id;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  value: NonEmptyString1000;
  version: PositiveInteger;
}