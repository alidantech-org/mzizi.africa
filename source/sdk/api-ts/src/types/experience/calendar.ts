import type { ExperienceCalendarEvent } from "#sdk/types/experience/calendar-event.ts";
import type { ExperienceCountdown } from "#sdk/types/experience/countdown.ts";

/** Calendar */
export interface ExperienceCalendar {
  events: ExperienceCalendarEvent[];
  from: string;
  gaps: string[];
  next?: ExperienceCountdown | null;
  to: string;
}
