import type { GeographyFeatureEntry } from "#sdk/types/geography/dto/feature-entry.ts";

/** Feature Collection */
export interface GeographyFeatureCollection {
  features: GeographyFeatureEntry[];
}
