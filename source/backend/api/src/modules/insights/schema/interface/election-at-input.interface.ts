import type { AddressLanguage } from "#/modules/insights/schema/type/address-language.type.ts";
import type { AddressPath } from "#/modules/insights/schema/type/address-path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/** Election At Input */
export interface ElectionAtInput {
  contestKind?: NonEmptyString100;
  countryCode: IsoAlpha2;
  electionId: Id;
  languageCode?: AddressLanguage;
  path?: AddressPath;
}
