import type { ExplorerCountryChoice } from "#sdk/types/explorer/dto/country-choice.ts";
import type { ExplorerLevel } from "#sdk/types/explorer/dto/level.ts";
import type { ExplorerPlace } from "#sdk/types/explorer/dto/place.ts";

/** Context */
export interface ExplorerContext {
  chain: ExplorerPlace[];
  country: ExplorerCountryChoice;
  gaps: string[];
  language: string;
  levels: ExplorerLevel[];
  place: ExplorerPlace;
}
