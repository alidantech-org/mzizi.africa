import type { ExplorerAddressPlace } from "#sdk/types/explorer/dto/address-place.ts";

/** Addresses */
export interface ExplorerAddresses {
  gaps: string[];
  places: ExplorerAddressPlace[];
}
