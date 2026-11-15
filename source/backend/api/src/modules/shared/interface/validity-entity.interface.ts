
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/** Base for versioned records valid over an optional period. */
export interface ValidityEntity {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}