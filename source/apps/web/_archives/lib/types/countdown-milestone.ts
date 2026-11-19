import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Countdown Milestone */
export interface CountdownMilestone {
  daysAway: number;
  name: string;
  offsetDays?: number | null;
  plannedOn: string;
}

/** Field metadata for forms and results. */
export const CountdownMilestoneFields: readonly FieldMeta[] = [
  { name: "daysAway", label: "Days Away", kind: "number", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "offsetDays", label: "Offset Days", kind: "number", required: false },
  { name: "plannedOn", label: "Planned On", kind: "date", required: true },
];
