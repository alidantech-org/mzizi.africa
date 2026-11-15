
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { UnitDetailNames } from "#/modules/geography/unit-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";

/** Unit Detail */
export interface UnitDetail {
  code: IdentityCode;
  countryId: Id | null;
  featureId: Id;
  names: UnitDetailNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}