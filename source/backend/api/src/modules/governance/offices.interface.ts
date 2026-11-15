
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One established public office, independent of any current holder and optionally scoped to a geographic unit. */
export interface Offices {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  institutionId: Id;
  officeKindId: Id;
  sourceCitationId?: Id | null;
  unitFeatureId?: Id | null;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}