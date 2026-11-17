import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Input */
export interface PlaceInput {
  featureId: string;
  languageCode?: string;
  onDate?: string;
}

/** Field metadata for forms and results. */
export const PlaceInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "languageCode", label: "Language Code", kind: "string", required: false },
  { name: "onDate", label: "On Date", kind: "date", required: false },
];
