
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One sourced contact channel for exactly one identity; visibility class governs handling of private values. */
export interface Contacts {
  createdAt: Instant;
  deletedAt?: Instant | null;
  entityId?: Id | null;
  id: Id;
  individualId?: Id | null;
  kindId: Id;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  value: NonEmptyString1000;
  version: PositiveInteger;
  visibilityId: Id;
}