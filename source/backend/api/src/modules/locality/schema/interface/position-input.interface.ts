import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { Latitude } from "#/modules/locality/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/locality/schema/type/longitude.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Position Input */
export interface PositionInput {
  languageCode?: LanguageCode;
  latitude: Latitude;
  longitude: Longitude;
  onDate?: CalendarDate;
}
