import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Calendar Input */
export interface CalendarInput {
  featureId?: Id;
  from?: CalendarDate;
  kindCode?: Code;
  languageCode?: Language;
  to?: CalendarDate;
}
