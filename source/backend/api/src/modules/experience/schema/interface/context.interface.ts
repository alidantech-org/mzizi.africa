import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { ContextCountry } from "#/modules/experience/schema/interface/context-country.interface.ts";
import type { ContextLevel } from "#/modules/experience/schema/interface/context-level.interface.ts";
import type { CountryChoice } from "#/modules/experience/schema/interface/country-choice.interface.ts";
import type { PlaceRef } from "#/modules/experience/schema/interface/place-ref.interface.ts";

/** Context */
export interface Context {
  chain: PlaceRef[];
  countries: CountryChoice[];
  country: ContextCountry;
  countrySource: NonEmptyString100;
  gaps: NonEmptyString500[];
  languageCode: NonEmptyString100;
  levels: ContextLevel[];
  place?: PlaceRef | null;
  rest: NonEmptyString255[];
}
