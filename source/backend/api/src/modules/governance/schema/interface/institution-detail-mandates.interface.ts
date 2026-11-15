import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Institution Detail Mandates */
export interface InstitutionDetailMandates {
  description: Description;
  kind: IdentityCode;
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}
