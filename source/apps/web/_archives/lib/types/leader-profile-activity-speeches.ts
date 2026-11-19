import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Activity Speeches */
export interface LeaderProfileActivitySpeeches {
  heldOn: string;
  kind: string;
  motion: string;
  motionCode: string;
  summary: string;
  wordCount: number;
}

/** Field metadata for forms and results. */
export const LeaderProfileActivitySpeechesFields: readonly FieldMeta[] = [
  { name: "heldOn", label: "Held On", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "motion", label: "Motion", kind: "string", required: true },
  { name: "motionCode", label: "Motion Code", kind: "string", required: true },
  { name: "summary", label: "Summary", kind: "string", required: true },
  { name: "wordCount", label: "Word Count", kind: "number", required: true },
];
