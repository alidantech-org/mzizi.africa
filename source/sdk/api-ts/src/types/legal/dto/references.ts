import { LegalReferenceMethod } from "#sdk/types/legal/enums/reference-method.ts";
import { LegalReferenceRelation } from "#sdk/types/legal/enums/reference-relation.ts";
import { LegalReviewStatus } from "#sdk/types/legal/enums/review-status.ts";

/** A cross-reference found inside a text ("subject to Article 24"). */
export interface LegalReferences {
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
