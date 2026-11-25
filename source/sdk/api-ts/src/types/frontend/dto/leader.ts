import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Leader */
export interface FrontendLeader {
  fromYear?: number | null;
  office: string;
  officeName: SharedLocalizedText;
  person?: string | null;
  personName?: SharedLocalizedText;
}
