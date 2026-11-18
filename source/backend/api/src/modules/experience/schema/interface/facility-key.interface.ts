import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";

/** Facility Key */
export interface FacilityKey {
  code: Code;
  languageCode?: Language;
}
