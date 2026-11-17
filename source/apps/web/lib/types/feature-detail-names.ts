import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Feature Detail Names */
export interface FeatureDetailNames {
  languageId: string;
  name: string;
}

/** Field metadata for forms and results. */
export const FeatureDetailNamesFields: readonly FieldMeta[] = [
  { name: "languageId", label: "Language Id", kind: "string", required: true },
  { name: "name", label: "Name", kind: "string", required: true },
];
