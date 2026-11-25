import { SharedTextDirection } from "#sdk/types/shared/enums/text-direction.ts";
import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Language Option */
export interface FrontendLanguageOption {
  code: string;
  direction: SharedTextDirection;
  name: SharedLocalizedText;
  tag: string;
}
