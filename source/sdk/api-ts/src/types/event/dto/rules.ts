import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced. */
export interface EventRules {
  adjustmentId?: string | null;
  anchorOn?: string | null;
  createdAt: string;
  dayOfMonth?: number | null;
  deletedAt?: string | null;
  eventId: string;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  intervalYears?: number | null;
  month?: number | null;
  nthWeekday?: number | null;
  rrule?: string | null;
  ruleKindId: string;
  sourceCitationId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
  weekday?: number | null;
}
