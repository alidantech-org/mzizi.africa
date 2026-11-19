import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type PlaceStatisticsSiblingsDensity } from "#/lib/types/place-statistics-siblings-density.ts";
import { type PlaceStatisticsSiblingsPopulation } from "#/lib/types/place-statistics-siblings-population.ts";

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
