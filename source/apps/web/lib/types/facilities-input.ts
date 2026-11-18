import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Facilities Input */
export interface FacilitiesInput {
  classCode?: string;
  featureId?: string;
  languageCode?: string;
  limit?: number;
  query?: string;
}

/** Field metadata for forms and results. */
export const FacilitiesInputFields: readonly FieldMeta[] = [
  { name: "classCode", label: "Class Code", kind: "string", required: false },
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
  { name: "languageCode", label: "Language Code", kind: "string", required: false },
  { name: "limit", label: "Limit", kind: "number", required: false },
  { name: "query", label: "Query", kind: "string", required: false },
];
