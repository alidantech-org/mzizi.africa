
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Stable identity for one organization or legally identified entity; its names are stored in official.names. */
export interface Entities {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  dissolvedOn?: CalendarDate | null;
  id: Id;
  kindId: Id;
  registeredOn?: CalendarDate | null;
  registrationCountryId?: Id | null;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  version: PositiveInteger;
}