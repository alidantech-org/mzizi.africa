import type { FrontendOfficeRow } from "#sdk/types/frontend/dto/office-row.ts";
import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Institution Screen */
export interface FrontendInstitutionScreen {
  arm?: SharedLocalizedText;
  code: string;
  language: string;
  name: SharedLocalizedText;
  offices: FrontendOfficeRow[];
}
