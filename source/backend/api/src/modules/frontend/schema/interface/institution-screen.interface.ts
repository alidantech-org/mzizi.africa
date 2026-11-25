import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { OfficeRow } from "#/modules/frontend/schema/interface/office-row.interface.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Institution Screen */
export interface InstitutionScreen {
  arm?: LocalizedText;
  code: IdentityCode;
  language: LanguageCode;
  name: LocalizedText;
  offices: OfficeRow[];
}
