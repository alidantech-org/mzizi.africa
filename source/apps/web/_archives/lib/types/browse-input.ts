import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Browse Input */
export interface BrowseInput {
  featureId?: string;
}

/** Field metadata for forms and results. */
export const BrowseInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: false },
];
