import type { ExplorerCountryChoice } from "#sdk/types/explorer/dto/country-choice.ts";
import type { ExplorerNavigationItem } from "#sdk/types/explorer/dto/navigation-item.ts";

/** Navigation */
export interface ExplorerNavigation {
  country: ExplorerCountryChoice;
  gaps: string[];
  items: ExplorerNavigationItem[];
}
