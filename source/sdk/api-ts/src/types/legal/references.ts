import { LegalReferenceMethod } from "#sdk/types/enums/legal/reference-method.ts";
import { LegalReferenceRelation } from "#sdk/types/enums/legal/reference-relation.ts";
import { LegalReviewStatus } from "#sdk/types/enums/legal/review-status.ts";

/** A textual mention of a provision inside a wording or translation, with the exact span. A mention is not an amendment. */
export interface LegalReferences {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  method: LegalReferenceMethod;
  relation: LegalReferenceRelation;
  reviewStatus: LegalReviewStatus;
  spanEnd: number;
  spanStart: number;
  spanText: string;
  targetProvisionId: string;
  targetWordingId?: string | null;
  translationId?: string | null;
  updatedAt: string;
  version: number;
  wordingId?: string | null;
}
