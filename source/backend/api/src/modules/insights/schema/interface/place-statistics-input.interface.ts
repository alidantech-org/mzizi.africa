import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Place Statistics Input */
export interface PlaceStatisticsInput {
  countryCode: IsoAlpha2;
  languageCode?: AddressLanguage;
  path?: AddressPath;
  scope?: String;
  topic?: String;
}
