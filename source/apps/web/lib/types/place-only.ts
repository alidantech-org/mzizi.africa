import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Only */
export interface PlaceOnly {
  featureId: string;
}

/** Field metadata for forms and results. */
export const PlaceOnlyFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
];
