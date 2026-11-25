import type { ReferenceCountryDetailLocales } from "#sdk/types/reference/dto/country-detail-locales.ts";
import type { ReferenceCountryDetailNames } from "#sdk/types/reference/dto/country-detail-names.ts";

/** Country Detail */
export interface ReferenceCountryDetail {
  callingCode: string | null;
  code: string;
  countryId: string;
  currencyId: string | null;
  designationTerm: string | null;
  establishedOn: string | null;
  isoAlpha2: string | null;
  isoAlpha3: string | null;
  isoNumeric: string | null;
  locales: ReferenceCountryDetailLocales[];
  names: ReferenceCountryDetailNames[];
  recognitionTerm: string | null;
}
