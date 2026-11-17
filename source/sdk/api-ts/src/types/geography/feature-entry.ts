import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";
import type { GeographyFeatureEntryNames } from "#sdk/types/geography/feature-entry-names.ts";

/** Feature Entry */
export interface GeographyFeatureEntry {
  code: string;
  featureId: string;
  featureTypeId: string;
  fromToPrecision: SharedDatePrecision | null;
  fromYear: number | null;
  names: GeographyFeatureEntryNames[];
  toYear: number | null;
}
