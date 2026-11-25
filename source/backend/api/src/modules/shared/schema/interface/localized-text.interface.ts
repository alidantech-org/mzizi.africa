import type { TextDirection } from "#/modules/shared/schema/enum/text-direction.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/** Localized Text */
export interface LocalizedText {
  direction: TextDirection;
  isFallback: Flag;
  language: LanguageCode;
  text: NonEmptyString1000;
}
