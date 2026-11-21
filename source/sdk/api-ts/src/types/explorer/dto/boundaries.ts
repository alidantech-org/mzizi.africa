import type { ExplorerBoundaryShape } from "#sdk/types/explorer/dto/boundary-shape.ts";
import type { ExplorerPlace } from "#sdk/types/explorer/dto/place.ts";

/** Boundaries */
export interface ExplorerBoundaries {
  bbox: number[];
  gaps: string[];
  place: ExplorerPlace;
  shapes: ExplorerBoundaryShape[];
  withoutBoundary: number;
}
