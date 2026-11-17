import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";
import type { GeographyFeatureDetailNames } from "#sdk/types/geography/feature-detail-names.ts";

/** Feature Detail */
export interface GeographyFeatureDetail {
  code: string;
  featureId: string;
  featureTypeId: string;
  fromToPrecision: SharedDatePrecision | null;
  fromYear: number | null;
  names: GeographyFeatureDetailNames[];
  toYear: number | null;
}
