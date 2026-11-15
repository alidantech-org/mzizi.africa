
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** One real human identity; names, identifiers and contacts are normalized in shared tables. */
export interface Individuals {
  birthDate?: CalendarDate | null;
  code: IdentityCode;
  createdAt: Instant;
  deathDate?: CalendarDate | null;
  deletedAt?: Instant | null;
  id: Id;
  sourceCitationId?: Id | null;
  updatedAt: Instant;
  version: PositiveInteger;
}