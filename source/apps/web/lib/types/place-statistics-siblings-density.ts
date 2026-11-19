import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Place Statistics Siblings Density */
export interface PlaceStatisticsSiblingsDensity {
  of: number;
  position: number;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsSiblingsDensityFields: readonly FieldMeta[] = [
  { name: "of", label: "Of", kind: "number", required: true },
  { name: "position", label: "Position", kind: "number", required: true },
];
