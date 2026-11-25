import type { ReferenceCountryEntryNames } from "#sdk/types/reference/dto/country-entry-names.ts";

/** Country Entry */
export interface ReferenceCountryEntry {
  callingCode: string | null;
  code: string;
  countryId: string;
  currencyCode: string | null;
  isoAlpha2: string | null;
  isoAlpha3: string | null;
  names: ReferenceCountryEntryNames[];
}
