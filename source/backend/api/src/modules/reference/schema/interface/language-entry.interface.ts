import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Iso6393 } from "#/modules/reference/schema/type/iso6393.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LanguageEntryNames } from "#/modules/reference/schema/interface/language-entry-names.interface.ts";

/** Language Entry */
export interface LanguageEntry {
  code: IdentityCode;
  directionTerm: Id | null;
  iso6391: Iso6391 | null;
  iso6393: Iso6393 | null;
  languageId: Id;
  names: LanguageEntryNames[];
}
