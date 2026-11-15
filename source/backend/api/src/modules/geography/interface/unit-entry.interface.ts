
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { UnitEntryNames } from "#/modules/geography/interface/unit-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";

/** Unit Entry */
export interface UnitEntry {
  code: IdentityCode;
  countryId: Id | null;
  featureId: Id;
  names: UnitEntryNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}