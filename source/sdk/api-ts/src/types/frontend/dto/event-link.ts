import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Event Link */
export interface FrontendEventLink {
  code: string;
  name: SharedLocalizedText;
  startsOn: string;
}
