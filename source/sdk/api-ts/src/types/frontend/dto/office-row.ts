import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Office Row */
export interface FrontendOfficeRow {
  fromYear?: number | null;
  holder?: SharedLocalizedText;
  holderCode?: string | null;
  name: SharedLocalizedText;
  office: string;
}
