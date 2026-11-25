import { LegalReviewStatus } from "#sdk/types/legal/enums/review-status.ts";

/** What a provision does to a named thing; a reviewed assertion that never changes the thing itself. */
export interface LegalEffects {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  effectiveOn?: string | null;
  endedOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  kindTerm: string;
  note?: string | null;
  noteLanguageId?: string | null;
  reviewStatus: LegalReviewStatus;
  toYear?: number | null;
  updatedAt: string;
  version: number;
  wordingId: string;
}
