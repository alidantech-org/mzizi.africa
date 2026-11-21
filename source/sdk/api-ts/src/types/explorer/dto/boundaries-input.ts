import { ExplorerBoundaryMode } from "#sdk/types/explorer/enums/boundary-mode.ts";

/** Boundaries Input */
export interface ExplorerBoundariesInput {
  countryCode: string;
  languageCode?: string;
  limit?: number;
  mode?: ExplorerBoundaryMode;
  path?: string;
  simplify?: number;
}
