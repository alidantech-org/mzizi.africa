import type { ExplorerContext } from "#sdk/types/explorer/dto/context.ts";
import type { ExplorerCount } from "#sdk/types/explorer/dto/count.ts";
import type { ExplorerPlaces } from "#sdk/types/explorer/dto/places.ts";

/** Overview */
export interface ExplorerOverview {
  children: ExplorerPlaces;
  context: ExplorerContext;
  counts: ExplorerCount[];
  gaps: string[];
}
