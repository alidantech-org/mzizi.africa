import type { GeographyFeatureDetailNames } from "#sdk/types/geography/feature-detail-names.ts";

/** Feature Detail */
export interface GeographyFeatureDetail {
  code: string;
  featureId: string;
  featureTypeId: string;
  names: GeographyFeatureDetailNames[];
  validFrom: string | null;
  validUntil: string | null;
}
