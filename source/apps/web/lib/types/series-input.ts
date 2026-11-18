import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Series Input */
export interface SeriesInput {
  featureId: string;
  indicatorCode: string;
}

/** Field metadata for forms and results. */
export const SeriesInputFields: readonly FieldMeta[] = [
  { name: "featureId", label: "Feature Id", kind: "string", required: true },
  { name: "indicatorCode", label: "Indicator Code", kind: "string", required: true },
];
