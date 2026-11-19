import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Recorded */
export interface Recorded {
  recorded: boolean;
}

/** Field metadata for forms and results. */
export const RecordedFields: readonly FieldMeta[] = [
  { name: "recorded", label: "Recorded", kind: "boolean", required: true },
];
