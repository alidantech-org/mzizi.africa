import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Feature Detail Names */
export interface FeatureDetailNames {
  languageTag: string | null;
  name: string;
}

/** Field metadata for forms and results. */
export const FeatureDetailNamesFields: readonly FieldMeta[] = [
  { name: "languageTag", label: "Language Tag", kind: "string", required: false },
  { name: "name", label: "Name", kind: "string", required: true },
];
