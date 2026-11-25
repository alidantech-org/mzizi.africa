import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Search Hit */
export interface FrontendSearchHit {
  code: string;
  context?: SharedLocalizedText;
  kind: string;
  name: SharedLocalizedText;
}
