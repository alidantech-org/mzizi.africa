import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Feature Entry Names */
export interface FeatureEntryNames {
  languageId: string;
  name: string;
}

/** Field metadata for forms and results. */
export const FeatureEntryNamesFields: readonly FieldMeta[] = [
  { name: "languageId", label: "Language Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
