import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Motion Detail Motion Contributions */
export interface MotionDetailMotionContributions {
  holderId: string;
  kind: string;
  name: string;
  party?: string | null;
  summary: string;
  wordCount: number;
}

/** Field metadata for forms and results. */
export const MotionDetailMotionContributionsFields: readonly FieldMeta[] = [
  { name: "holderId", label: "Holder Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
  { name: "party", label: "Party", kind: "string", required: false },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "wordCount", label: "Word Count", kind: "number", required: true },
];
