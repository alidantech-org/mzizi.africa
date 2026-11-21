import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Comparison At Input */
export interface ComparisonAtInput {
  a: AddressPath;
  b: AddressPath;
  countryCode: IsoAlpha2;
  languageCode?: AddressLanguage;
  metrics?: NonEmptyString1000;
}
