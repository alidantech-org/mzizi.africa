import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";

/** Addresses Input */
export interface AddressesInput {
  addresses: Path[];
  languageCode?: LanguageCode;
}
