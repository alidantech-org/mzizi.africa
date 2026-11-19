import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type CountdownMilestone } from "#/_archives/lib/types/countdown-milestone";
import { type RecurrenceRule } from "#/_archives/lib/types/recurrence-rule";

/** Countdown */
export interface Countdown {
  daysAway: number;
  eventCode: string;
  knowledgeCode: string;
  knowledgeLabel: string;
  milestones: CountdownMilestone[];
  name: string;
  plannedOn: string;
  rule?: RecurrenceRule | null;
}

/** Field metadata for forms and results. */
export const CountdownFields: readonly FieldMeta[] = [
  { name: "daysAway", label: "Days Away", kind: "number", required: true },
  { name: "eventCode", label: "Event Code", kind: "string", required: true },
  {
    name: "knowledgeCode",
    label: "Knowledge Code",
    kind: "string",
    required: true,
  },
  {
    name: "knowledgeLabel",
    label: "Knowledge Label",
    kind: "string",
    required: true,
  },
  { name: "milestones", label: "Milestones", kind: "other", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "plannedOn", label: "Planned On", kind: "date", required: true },
  { name: "rule", label: "Rule", kind: "other", required: false },
];
