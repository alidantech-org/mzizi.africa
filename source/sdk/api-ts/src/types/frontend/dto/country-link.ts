import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Country Link */
export interface FrontendCountryLink {
  code: string;
  id: string;
  isoAlpha2?: string | null;
  name: SharedLocalizedText;
}
