import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Calendar Event */
export interface CalendarEvent {
  actualOn?: string | null;
  changeNote?: string | null;
  changeReason?: string | null;
  daysAway: number;
  eventCode: string;
  kindCode: string;
  kindLabel: string;
  knowledgeCode: string;
  knowledgeLabel: string;
  name: string;
  occurrenceCode: string;
  plannedOn: string;
  statusCode: string;
  statusLabel: string;
  venueCount: number;
}

/** Field metadata for forms and results. */
export const CalendarEventFields: readonly FieldMeta[] = [
  { name: "actualOn", label: "Actual On", kind: "date", required: false },
  { name: "changeNote", label: "Change Note", kind: "string", required: false },
  {
    name: "changeReason",
    label: "Change Reason",
    kind: "string",
    required: false,
  },
  { name: "daysAway", label: "Days Away", kind: "number", required: true },
  { name: "eventCode", label: "Event Code", kind: "string", required: true },
  { name: "kindCode", label: "Kind Code", kind: "string", required: true },
  { name: "kindLabel", label: "Kind Label", kind: "string", required: true },
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
  { name: "name", label: "Name", kind: "string", required: true },
  {
    name: "occurrenceCode",
    label: "Occurrence Code",
    kind: "string",
    required: true,
  },
  { name: "plannedOn", label: "Planned On", kind: "date", required: true },
  { name: "statusCode", label: "Status Code", kind: "string", required: true },
  {
    name: "statusLabel",
    label: "Status Label",
    kind: "string",
    required: true,
  },
  { name: "venueCount", label: "Venue Count", kind: "number", required: true },
];
