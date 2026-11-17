import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/** Language Choice */
export interface LanguageChoice {
  code: LanguageCode;
  name: Name;
  nativeName?: Name | null;
}
