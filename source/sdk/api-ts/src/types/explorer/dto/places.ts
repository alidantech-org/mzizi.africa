import type { ExplorerPlace } from "#sdk/types/explorer/dto/place.ts";

/** Places */
export interface ExplorerPlaces {
  gaps: string[];
  limit: number;
  page: number;
  places: ExplorerPlace[];
  total: number;
}
