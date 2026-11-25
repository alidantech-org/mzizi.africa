import type { CallingCode } from "#/modules/reference/schema/type/calling-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { IsoAlpha3 } from "#/modules/reference/schema/type/iso-alpha3.type.ts";
import type { IsoNumeric } from "#/modules/reference/schema/type/iso-numeric.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CountryDetailLocales } from "#/modules/reference/schema/interface/country-detail-locales.interface.ts";
import type { CountryDetailNames } from "#/modules/reference/schema/interface/country-detail-names.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Country Detail */
export interface CountryDetail {
  callingCode: CallingCode | null;
  code: IdentityCode;
  countryId: Id;
  currencyId: Id | null;
  designationTerm: Id | null;
  establishedOn: CalendarDate | null;
  isoAlpha2: IsoAlpha2 | null;
  isoAlpha3: IsoAlpha3 | null;
  isoNumeric: IsoNumeric | null;
  locales: CountryDetailLocales[];
  names: CountryDetailNames[];
  recognitionTerm: Id | null;
}
