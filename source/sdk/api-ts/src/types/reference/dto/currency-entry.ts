import type { ReferenceCurrencyEntryNames } from "#sdk/types/reference/dto/currency-entry-names.ts";

/** Currency Entry */
export interface ReferenceCurrencyEntry {
  code: string;
  currencyId: string;
  isoCode: string | null;
  minorUnits: number;
  names: ReferenceCurrencyEntryNames[];
  symbol: string | null;
}
