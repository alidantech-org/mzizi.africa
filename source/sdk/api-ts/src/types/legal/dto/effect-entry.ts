import { LegalReviewStatus } from "#sdk/types/legal/enums/review-status.ts";

/** Effect Entry */
export interface LegalEffectEntry {
  designation: string;
  effectId: string;
  effectiveOn: string | null;
  instrumentId: string;
  kindTerm: string;
  provisionId: string;
  reviewStatus: LegalReviewStatus;
  wordingId: string;
}
