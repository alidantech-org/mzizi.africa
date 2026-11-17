import type { GeographyFeatureEntryNames } from "#sdk/types/geography/feature-entry-names.ts";

/** Feature Entry */
export interface GeographyFeatureEntry {
  code: string;
  featureId: string;
  featureTypeId: string;
  names: GeographyFeatureEntryNames[];
  validFrom: string | null;
  validUntil: string | null;
}
