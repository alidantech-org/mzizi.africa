import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Motion Detail Parties */
export interface MotionDetailParties {
  absent: number;
  abstain: number;
  no: number;
  party: string;
  yes: number;
}

/** Field metadata for forms and results. */
export const MotionDetailPartiesFields: readonly FieldMeta[] = [
  { name: "absent", label: "Absent", kind: "number", required: true },
  { name: "abstain", label: "Abstain", kind: "number", required: true },
  { name: "no", label: "No", kind: "number", required: true },
  { name: "party", label: "Party", kind: "string", required: true },
  { name: "yes", label: "Yes", kind: "number", required: true },
];
