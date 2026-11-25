import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Calendar Window */
export interface CalendarWindow {
  countryId: Id;
  from: CalendarDate;
  limit?: Integer;
  offset?: Integer;
}
