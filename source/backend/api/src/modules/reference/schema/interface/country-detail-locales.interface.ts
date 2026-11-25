import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Country Detail Locales */
export interface CountryDetailLocales {
  fromYear: Year | null;
  languageCode: IdentityCode;
  languageId: Id;
  languageIso: Iso6391 | null;
  position: NonNegativeInteger;
  statusTerm: Id;
  toYear: Year | null;
}
