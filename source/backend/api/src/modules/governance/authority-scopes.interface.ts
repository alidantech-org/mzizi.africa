
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One institution or office authority over a required Geography unit for an effective period. */
export interface AuthorityScopes {
  authorityKindId: Id;
  countryId?: Id | null;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  institutionId?: Id | null;
  officeId?: Id | null;
  sourceCitationId?: Id | null;
  unitFeatureId: Id;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}