import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Recurrence Rule */
export interface RecurrenceRule {
  dayOfMonth?: number | null;
  intervalYears?: number | null;
  kindCode: string;
  month?: number | null;
  nthWeekday?: number | null;
  rrule?: string | null;
  weekday?: number | null;
}

/** Field metadata for forms and results. */
export const RecurrenceRuleFields: readonly FieldMeta[] = [
  { name: "dayOfMonth", label: "Day Of Month", kind: "number", required: false },
  { name: "intervalYears", label: "Interval Years", kind: "number", required: false },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "month", label: "Month", kind: "number", required: false },
  { name: "nthWeekday", label: "Nth Weekday", kind: "number", required: false },
  { name: "rrule", label: "Rrule", kind: "string", required: false },
  { name: "weekday", label: "Weekday", kind: "number", required: false },
];
