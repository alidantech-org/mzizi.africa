
import type { Id } from "#/modules/shared/id.type.ts";
import type { Percentage } from "#/modules/shared/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One directed typed relationship between exactly two Official identities, optionally with an ownership share. */
export interface Relationships {
  createdAt: Instant;
  deletedAt?: Instant | null;
  fromEntityId?: Id | null;
  fromIndividualId?: Id | null;
  id: Id;
  kindId: Id;
  sharePercentage?: Percentage | null;
  sourceCitationId?: Id | null;
  toEntityId?: Id | null;
  toIndividualId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}