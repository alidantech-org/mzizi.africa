/** Recurrence Rule */
export interface ExperienceRecurrenceRule {
  dayOfMonth?: number | null;
  intervalYears?: number | null;
  kindCode: string;
  month?: number | null;
  nthWeekday?: number | null;
  rrule?: string | null;
  weekday?: number | null;
}
