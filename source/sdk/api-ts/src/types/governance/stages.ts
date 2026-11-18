/** One step of a bill's passage in order: a reading, a committee, a vote in the other house, assent, publication. */
export interface GovernanceStages {
  billId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  motionId?: string | null;
  onDate?: string | null;
  outcomeId?: string | null;
  sequenceNumber: number;
  sittingId?: string | null;
  sourceCitationId?: string | null;
  stageKindId: string;
  updatedAt: string;
  version: number;
}
