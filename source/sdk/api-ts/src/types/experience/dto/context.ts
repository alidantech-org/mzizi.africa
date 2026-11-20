import type { ExperienceContextCountry } from "#sdk/types/experience/dto/context-country.ts";
import type { ExperienceContextLevel } from "#sdk/types/experience/dto/context-level.ts";
import type { ExperienceCountryChoice } from "#sdk/types/experience/dto/country-choice.ts";
import type { ExperiencePlaceRef } from "#sdk/types/experience/dto/place-ref.ts";

/** Context */
export interface ExperienceContext {
  chain: ExperiencePlaceRef[];
  countries: ExperienceCountryChoice[];
  country: ExperienceContextCountry;
  countrySource: string;
  gaps: string[];
  languageCode: string;
  levels: ExperienceContextLevel[];
  place?: ExperiencePlaceRef | null;
  rest: string[];
}
