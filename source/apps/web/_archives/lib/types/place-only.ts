import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Only */
export interface PlaceOnly {
  featureId: string;
}

/** Field metadata for forms and results. */
export const PlaceOnlyFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
];
