import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CalendarEvent } from "#/modules/experience/schema/interface/calendar-event.interface.ts";
import type { Countdown } from "#/modules/experience/schema/interface/countdown.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Calendar */
export interface Calendar {
  events: CalendarEvent[];
  from: CalendarDate;
  gaps: NonEmptyString500[];
  next?: Countdown | null;
  to: CalendarDate;
}
