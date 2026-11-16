import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for versioned records valid over a period whose start and end may be uncertain. */
export interface HistoricalValidityEntity {
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validFromEarliest?: CalendarDate | null;
  validFromLatest?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  validUntilEarliest?: CalendarDate | null;
  validUntilLatest?: CalendarDate | null;
  version: PositiveInteger;
}
