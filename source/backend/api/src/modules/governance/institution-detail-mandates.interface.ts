
import type { Description } from "#/modules/shared/description.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";

/** Institution Detail Mandates */
export interface InstitutionDetailMandates {
  description: Description;
  kind: IdentityCode;
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}