import type { FieldMeta } from "#/_archives/lib/dryv/transport";
import { type ContextCountry } from "#/_archives/lib/types/context-country";
import { type ContextLevel } from "#/_archives/lib/types/context-level";
import { type CountryChoice } from "#/_archives/lib/types/country-choice";
import { type PlaceRef } from "#/_archives/lib/types/place-ref";

/** Context */
export interface Context {
  chain: PlaceRef[];
  countries: CountryChoice[];
  country: ContextCountry;
  countrySource: string;
  gaps: string[];
  languageCode: string;
  levels: ContextLevel[];
  place?: PlaceRef | null;
  rest: string[];
}

/** Field metadata for forms and results. */
export const ContextFields: readonly FieldMeta[] = [
  { name: "chain", label: "Chain", kind: "other", required: true },
  { name: "countries", label: "Countries", kind: "other", required: true },
  { name: "country", label: "Country", kind: "other", required: true },
  {
    name: "countrySource",
    label: "Country Source",
    kind: "string",
    required: true,
  },
  { name: "gaps", label: "Gaps", kind: "string", required: true },
  {
    name: "languageCode",
    label: "Language Code",
    kind: "string",
    required: true,
  },
  { name: "levels", label: "Levels", kind: "other", required: true },
  { name: "place", label: "Place", kind: "other", required: false },
  { name: "rest", label: "Rest", kind: "string", required: true },
];
