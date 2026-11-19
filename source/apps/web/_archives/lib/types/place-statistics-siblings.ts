import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceStatisticsSiblingsDensity } from "#/_archives/lib/types/place-statistics-siblings-density";
import { type PlaceStatisticsSiblingsPopulation } from "#/_archives/lib/types/place-statistics-siblings-population";

/** Place Statistics Siblings */
export interface PlaceStatisticsSiblings {
  density?: PlaceStatisticsSiblingsDensity | null;
  peers: number;
  population?: PlaceStatisticsSiblingsPopulation | null;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsSiblingsFields: readonly FieldMeta[] = [
  { name: "density", label: "Density", kind: "other", required: false },
  { name: "peers", label: "Peers", kind: "number", required: true },
  { name: "population", label: "Population", kind: "other", required: false },
];
