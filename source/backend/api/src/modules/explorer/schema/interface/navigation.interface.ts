import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CountryChoice } from "#/modules/explorer/schema/interface/country-choice.interface.ts";
import type { NavigationItem } from "#/modules/explorer/schema/interface/navigation-item.interface.ts";

/** Navigation */
export interface Navigation {
  country: CountryChoice;
  gaps: NonEmptyString500[];
  items: NavigationItem[];
}
