import type { CallingCode } from "#/modules/reference/schema/type/calling-code.type.ts";
import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { IsoAlpha3 } from "#/modules/reference/schema/type/iso-alpha3.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CountryEntryNames } from "#/modules/reference/schema/interface/country-entry-names.interface.ts";

/** Country Entry */
export interface CountryEntry {
  callingCode: CallingCode | null;
  code: IdentityCode;
  countryId: Id;
  currencyCode: CurrencyCode | null;
  isoAlpha2: IsoAlpha2 | null;
  isoAlpha3: IsoAlpha3 | null;
  names: CountryEntryNames[];
}
