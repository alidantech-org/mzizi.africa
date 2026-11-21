import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/** Compare Options At Input */
export interface CompareOptionsAtInput {
  countryCode: IsoAlpha2;
  languageCode?: AddressLanguage;
  metric?: Code;
  path?: AddressPath;
}
