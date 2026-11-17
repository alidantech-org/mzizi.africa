import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Feature Entry Names */
export interface FeatureEntryNames {
  languageTag: string | null;
  name: string;
}

/** Field metadata for forms and results. */
export const FeatureEntryNamesFields: readonly FieldMeta[] = [
  { name: "languageTag", label: "Language Tag", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
];
