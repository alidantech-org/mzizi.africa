import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type CalendarEvent } from "#/lib/types/calendar-event.ts";
import { type Countdown } from "#/lib/types/countdown.ts";

/** Calendar */
export interface Calendar {
  events: CalendarEvent[];
  from: string;
  gaps: string[];
  next?: Countdown | null;
  to: string;
}

/** Field metadata for forms and results. */
export const CalendarFields: readonly FieldMeta[] = [
  { name: "events", label: "Events", kind: "other", required: true },
  { name: "from", label: "From", kind: "date", required: true },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "next", label: "Next", kind: "other", required: false },
  { name: "to", label: "To", kind: "date", required: true },
];
