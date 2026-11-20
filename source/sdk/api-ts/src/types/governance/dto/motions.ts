/** One matter put to a sitting, with its outcome, tied to the bill, law provision or budget it concerns. */
export interface GovernanceMotions {
  billId?: string | null;
  budgetVersionId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fiscalPeriodId?: string | null;
  id: string;
  instrumentId?: string | null;
  motionKindId: string;
  movedByHolderId?: string | null;
  outcomeId: string;
  provisionId?: string | null;
  sittingId: string;
  sourceCitationId?: string | null;
  summary?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
