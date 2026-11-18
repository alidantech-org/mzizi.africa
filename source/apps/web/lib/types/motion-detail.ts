import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Motion Detail */
export interface MotionDetail {
  gaps: string[];
  legal?: unknown | null;
  members: unknown[];
  motion: unknown;
  parties: unknown[];
  tally: unknown;
}

/** Field metadata for forms and results. */
export const MotionDetailFields: readonly FieldMeta[] = [
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  { name: "legal", label: "Legal", kind: "other", required: false },
  { name: "members", label: "Members", kind: "other", required: true },
  { name: "motion", label: "Motion", kind: "other", required: true },
  { name: "parties", label: "Parties", kind: "other", required: true },
  { name: "tally", label: "Tally", kind: "other", required: true },
];
