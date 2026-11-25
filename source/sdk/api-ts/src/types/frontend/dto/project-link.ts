import type { SharedLocalizedText } from "#sdk/types/shared/dto/localized-text.ts";

/** Project Link */
export interface FrontendProjectLink {
  code: string;
  name: SharedLocalizedText;
  status?: SharedLocalizedText;
}
