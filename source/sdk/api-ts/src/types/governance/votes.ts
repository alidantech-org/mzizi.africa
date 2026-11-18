/** One office holder's recorded position on one motion (a division), including being absent. */
export interface GovernanceVotes {
  createdAt: string;
  deletedAt?: string | null;
  holderId: string;
  id: string;
  motionId: string;
  positionId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
