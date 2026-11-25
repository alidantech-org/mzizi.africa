import { LegalReviewStatus } from "#sdk/types/legal/enums/review-status.ts";
import { LegalTranslationMethod } from "#sdk/types/legal/enums/translation-method.ts";

/** Mzizi's own unofficial translation of a wording; never legal authority. */
export interface LegalTranslations {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  method: LegalTranslationMethod;
  notes?: string | null;
  review: LegalReviewStatus;
  reviewedAt?: string | null;
  reviewedById?: string | null;
  text: string;
  updatedAt: string;
  version: number;
  wordingId: string;
}
