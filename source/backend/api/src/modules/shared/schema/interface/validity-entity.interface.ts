
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

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