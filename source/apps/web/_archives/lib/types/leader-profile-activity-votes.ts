import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Activity Votes */
export interface LeaderProfileActivityVotes {
  absent: number;
  abstain: number;
  attendance?: number | null;
  no: number;
  total: number;
  yes: number;
}

/** Field metadata for forms and results. */
export const LeaderProfileActivityVotesFields: readonly FieldMeta[] = [
  { name: "absent", label: "Absent", kind: "number", required: true },
  { name: "abstain", label: "Abstain", kind: "number", required: true },
  { name: "attendance", label: "Attendance", kind: "number", required: false },
  { name: "no", label: "No", kind: "number", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "yes", label: "Yes", kind: "number", required: true },
];
