import type { ExplorerContext } from "#sdk/types/explorer/dto/context.ts";
import type { ExplorerPlaceGroup } from "#sdk/types/explorer/dto/place-group.ts";
import type { ExplorerPlaces } from "#sdk/types/explorer/dto/places.ts";

/** Location */
export interface ExplorerLocation {
  context: ExplorerContext;
  found?: ExplorerPlaces | null;
  gaps: string[];
  groups: ExplorerPlaceGroup[];
}
