import { ExplorerResolutionStatus } from "#sdk/types/explorer/enums/resolution-status.ts";
import type { ExplorerPlace } from "#sdk/types/explorer/dto/place.ts";

/** Resolution */
export interface ExplorerResolution {
  candidates: ExplorerPlace[];
  gaps: string[];
  status: ExplorerResolutionStatus;
}
