import type { ExplorerPlace } from "#sdk/types/explorer/dto/place.ts";

/** Address Place */
export interface ExplorerAddressPlace {
  address: string;
  place?: ExplorerPlace | null;
}
