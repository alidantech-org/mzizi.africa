import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Place Input */
export interface PlaceInput {
  countryCode: IsoAlpha2;
  featureId?: Id;
  languageCode?: LanguageCode;
  path?: Path;
}
