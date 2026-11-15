
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Base for versioned records with a unique identity code and an optional validity period. */
export interface CodedValidityEntity {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  id: Id;
  updatedAt: Instant;
  validFrom?: CalendarDate | null;
  validUntil?: CalendarDate | null;
  version: PositiveInteger;
}