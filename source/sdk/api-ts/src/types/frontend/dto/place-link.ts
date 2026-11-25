import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Place Link */
export interface FrontendPlaceLink {
  code: string;
  id: string;
  kind?: SharedLocalizedText;
  name: SharedLocalizedText;
}
