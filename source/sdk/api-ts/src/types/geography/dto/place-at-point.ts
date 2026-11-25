import type { GeographyPlaceEntry } from "#sdk/types/geography/dto/place-entry.ts";

/** Place At Point */
export interface GeographyPlaceAtPoint {
  places: GeographyPlaceEntry[];
}
