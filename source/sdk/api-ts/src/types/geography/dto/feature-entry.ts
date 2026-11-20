import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import type { GeographyFeatureEntryNames } from "#sdk/types/geography/dto/feature-entry-names.ts";

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
