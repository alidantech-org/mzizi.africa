import type { ExplorerPlace } from "#sdk/types/explorer/dto/place.ts";

/** Place Group */
export interface ExplorerPlaceGroup {
  children: ExplorerPlace[];
  place: ExplorerPlace;
  total: number;
}
