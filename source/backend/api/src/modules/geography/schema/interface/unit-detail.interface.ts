import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { UnitDetailNames } from "#/modules/geography/schema/interface/unit-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Unit Detail */
export interface UnitDetail {
  code: IdentityCode;
  countryId: Id | null;
  featureId: Id;
  names: UnitDetailNames[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}
