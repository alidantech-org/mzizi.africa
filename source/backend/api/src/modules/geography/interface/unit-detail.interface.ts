
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { UnitDetailNames } from "#/modules/geography/interface/unit-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";

/** Unit Detail */
export interface UnitDetail {
  code: IdentityCode;
  countryId: Id | null;
  featureId: Id;
  names: UnitDetailNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}