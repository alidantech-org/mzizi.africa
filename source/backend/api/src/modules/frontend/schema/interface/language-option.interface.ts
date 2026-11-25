import type { TextDirection } from "#/modules/shared/schema/enum/text-direction.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { LocalizedText } from "#/modules/shared/schema/interface/localized-text.interface.ts";

/** Language Option */
export interface LanguageOption {
  code: IdentityCode;
  direction: TextDirection;
  name: LocalizedText;
  tag: LanguageCode;
}
