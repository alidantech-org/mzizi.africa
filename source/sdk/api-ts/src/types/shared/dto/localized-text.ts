import { SharedTextDirection } from "#sdk/types/shared/enums/text-direction.ts";

/** Localized Text */
export interface SharedLocalizedText {
  direction: SharedTextDirection;
  isFallback: boolean;
  language: string;
  text: string;
}
