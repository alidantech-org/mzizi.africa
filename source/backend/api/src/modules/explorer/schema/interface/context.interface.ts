import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CountryChoice } from "#/modules/explorer/schema/interface/country-choice.interface.ts";
import type { Level } from "#/modules/explorer/schema/interface/level.interface.ts";
import type { Place } from "#/modules/explorer/schema/interface/place.interface.ts";

/** Context */
export interface Context {
  chain: Place[];
  country: CountryChoice;
  gaps: NonEmptyString500[];
  language: LanguageCode;
  levels: Level[];
  place: Place;
}
