import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Tenders At Input */
export interface TendersAtInput {
  countryCode: IsoAlpha2;
  languageCode?: AddressLanguage;
  limit?: Limit;
  path?: AddressPath;
  status?: NonEmptyString100;
}
