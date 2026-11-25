import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Event Link */
export interface EventLink {
  code: IdentityCode;
  name: LocalizedText;
  startsOn: CalendarDate;
}
