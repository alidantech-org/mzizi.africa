import type { Language } from "#/modules/experience/schema/type/language.type.ts";
import type { CopyEntry } from "#/modules/experience/schema/interface/copy-entry.interface.ts";

/** Copy Catalog */
export interface CopyCatalog {
  entries: CopyEntry[];
  languageCode: Language;
}
