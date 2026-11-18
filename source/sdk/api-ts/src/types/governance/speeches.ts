/** One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech. */
export interface GovernanceSpeeches {
  billId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  hansardId?: string | null;
  holderId: string;
  id: string;
  motionId?: string | null;
  pageReference?: string | null;
  position: number;
  sittingId: string;
  sourceCitationId?: string | null;
  speechKindId: string;
  summary?: string | null;
  updatedAt: string;
  version: number;
  wordCount?: number | null;
}
