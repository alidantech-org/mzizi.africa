
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. */
export interface Relationships {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  objectFeatureId: Id;
  relationshipKindId: Id;
  sourceRefId?: Id | null;
  subjectFeatureId: Id;
  systemId: Id;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}