import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Place Input */
export interface PlaceInput {
  featureId: Id;
  languageCode?: LanguageCode;
  onDate?: CalendarDate;
}
