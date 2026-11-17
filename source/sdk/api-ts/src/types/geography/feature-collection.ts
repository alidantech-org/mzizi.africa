import type { GeographyFeatureEntry } from "#sdk/types/geography/feature-entry.ts";

/** Feature Collection */
export interface GeographyFeatureCollection {
  features: GeographyFeatureEntry[];
}
