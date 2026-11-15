
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { UnitEntryNames } from "#/modules/geography/unit-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";

/** Unit Entry */
export interface UnitEntry {
  code: IdentityCode;
  countryId: Id | null;
  featureId: Id;
  names: UnitEntryNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}