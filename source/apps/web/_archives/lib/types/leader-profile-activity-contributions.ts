import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Leader Profile Activity Contributions */
export interface LeaderProfileActivityContributions {
  count: number;
  words: number;
}

/** Field metadata for forms and results. */
export const LeaderProfileActivityContributionsFields: readonly FieldMeta[] = [
  { name: "count", label: "Count", kind: "number", required: true },
  { name: "words", label: "Words", kind: "number", required: true },
];
