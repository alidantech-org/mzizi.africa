import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Motion Detail Tally */
export interface MotionDetailTally {
  absent: number;
  abstain: number;
  no: number;
  passed: boolean;
  total: number;
  yes: number;
}

/** Field metadata for forms and results. */
export const MotionDetailTallyFields: readonly FieldMeta[] = [
  { name: "absent", label: "Absent", kind: "number", required: true },
  { name: "abstain", label: "Abstain", kind: "number", required: true },
  { name: "no", label: "No", kind: "number", required: true },
  { name: "passed", label: "Passed", kind: "boolean", required: true },
  { name: "total", label: "Total", kind: "number", required: true },
  { name: "yes", label: "Yes", kind: "number", required: true },
];
