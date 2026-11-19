import type { FieldMeta } from "#/lib/dryv/transport.ts";

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
