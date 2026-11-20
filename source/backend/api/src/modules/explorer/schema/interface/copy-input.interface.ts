import type { CopyArea } from "#/modules/explorer/schema/type/copy-area.type.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/** Copy Input */
export interface CopyInput {
  area?: CopyArea;
  countryCode?: IsoAlpha2;
  languageCode: LanguageCode;
}
