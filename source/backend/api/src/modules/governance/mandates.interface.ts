
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One responsibility or authority assignment for an institution or office. */
export interface Mandates {
  createdAt: Instant;
  deletedAt?: Instant | null;
  description: Description;
  id: Id;
  institutionId?: Id | null;
  mandateKindId: Id;
  officeId?: Id | null;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}