
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One person's continuous tenure in one office, with appointment kind and effective dates. */
export interface Holders {
  appointedByEntityId?: Id | null;
  appointmentKindId: Id;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  individualId: Id;
  officeId: Id;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}