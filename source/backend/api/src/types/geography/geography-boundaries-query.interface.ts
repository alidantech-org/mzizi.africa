
import type { CountryFilter } from "#/types/geography/country-filter.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Geography Boundaries Query */
export interface GeographyBoundariesQuery {
  country: CountryFilter;
  level: Label;
}