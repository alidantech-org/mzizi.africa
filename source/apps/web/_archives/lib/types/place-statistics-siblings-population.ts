import type { FieldMeta } from "#/_archives/lib/dryv/transport";

/** Place Statistics Siblings Population */
export interface PlaceStatisticsSiblingsPopulation {
  of: number;
  position: number;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsSiblingsPopulationFields: readonly FieldMeta[] = [
  { name: "of", label: "Of", kind: "number", required: true },
  { name: "position", label: "Position", kind: "number", required: true },
];
