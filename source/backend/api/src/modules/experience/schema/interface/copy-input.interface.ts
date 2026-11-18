import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";

/** Copy Input */
export interface CopyInput {
  countryCode?: Code;
  languageCode?: Language;
  prefix?: Code;
}
