import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type PlaceStatisticsComparisonsPlace } from "#/_archives/lib/types/place-statistics-comparisons-place";

/** Place Statistics Comparisons */
export interface PlaceStatisticsComparisons {
  areaKm2?: number | null;
  density?: number | null;
  place: PlaceStatisticsComparisonsPlace;
  population?: number | null;
}

/** Field metadata for forms and results. */
export const PlaceStatisticsComparisonsFields: readonly FieldMeta[] = [
  { name: "areaKm2", label: "Area Km2", kind: "number", required: false },
  { name: "density", label: "Density", kind: "number", required: false },
  { name: "place", label: "Place", kind: "other", required: true },
  { name: "population", label: "Population", kind: "number", required: false },
];
