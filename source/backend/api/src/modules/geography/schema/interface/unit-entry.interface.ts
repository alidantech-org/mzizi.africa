import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { UnitEntryNames } from "#/modules/geography/schema/interface/unit-entry-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Unit Entry */
export interface UnitEntry {
  code: IdentityCode;
  countryId: Id | null;
  featureId: Id;
  names: UnitEntryNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}
