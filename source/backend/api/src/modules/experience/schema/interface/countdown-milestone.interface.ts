import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Countdown Milestone */
export interface CountdownMilestone {
  daysAway: Integer;
  name: Name;
  offsetDays?: Integer | null;
  plannedOn: CalendarDate;
}
