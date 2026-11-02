import type { GeographyEntity } from "#/types/geography/geography-entity.interface.ts";

/** Geography Search Response */
export interface GeographySearchResponse {
  results: GeographyEntity[];
}
