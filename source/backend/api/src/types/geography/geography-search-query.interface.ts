import type { CountryFilter } from "#/types/geography/country-filter.type.ts";
import type { ResultLimit } from "#/types/geography/result-limit.type.ts";
import type { SearchText } from "#/types/geography/search-text.type.ts";

/** Geography Search Query */
export interface GeographySearchQuery {
  country?: CountryFilter;
  limit?: ResultLimit;
  q: SearchText;
}
