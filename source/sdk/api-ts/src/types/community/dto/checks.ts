import { CommunityChecker } from "#sdk/types/community/enums/checker.ts";
import { CommunityVerdict } from "#sdk/types/community/enums/verdict.ts";

/** One automated or human check of a moderation case. */
export interface CommunityChecks {
  caseId: string;
  categoryTerm?: string | null;
  checkedAt: string;
  checker: CommunityChecker;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  score?: number | null;
  updatedAt: string;
  verdict: CommunityVerdict;
  version: number;
}
