import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for versioned records with a unique identity code and an uncertain validity period. */
export interface CodedHistoricalEntity {
  code: IdentityCode;
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
