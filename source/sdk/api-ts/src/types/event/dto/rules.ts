/** When an event recurs. */
export interface EventRules {
  adjustmentTerm?: string | null;
  anchorOn?: string | null;
  createdAt: string;
  dayOfMonth?: number | null;
  deletedAt?: string | null;
  eventId: string;
  fromYear?: number | null;
  id: string;
  intervalYears?: number | null;
  kindTerm: string;
  month?: number | null;
  nthWeekday?: number | null;
  rrule?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
  weekday?: number | null;
}
