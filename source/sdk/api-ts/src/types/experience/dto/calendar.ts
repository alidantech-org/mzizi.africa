import type { ExperienceCalendarEvent } from "#sdk/types/experience/dto/calendar-event.ts";
import type { ExperienceCountdown } from "#sdk/types/experience/dto/countdown.ts";

/** Calendar */
export interface ExperienceCalendar {
  events: ExperienceCalendarEvent[];
  from: string;
  gaps: string[];
  next?: ExperienceCountdown | null;
  to: string;
}
