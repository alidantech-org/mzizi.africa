import { LegalReviewStatus } from "#sdk/types/enums/legal/review-status.ts";
import { LegalTranslationMethod } from "#sdk/types/enums/legal/translation-method.ts";

/** A translated representation of one exact wording. Several translations into one language are valid; review never makes a translation legal authority. */
export interface LegalTranslations {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  method: LegalTranslationMethod;
  notes?: string | null;
  producedAt?: string | null;
  producedBy?: string | null;
  reviewStatus: LegalReviewStatus;
  reviewedAt?: string | null;
  reviewedBySnapshot?: string | null;
  text: string;
  updatedAt: string;
  version: number;
  wordingId: string;
}
