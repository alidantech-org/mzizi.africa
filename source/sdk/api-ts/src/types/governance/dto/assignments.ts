/** Which institution or position carries a function, and who leads it. */
export interface GovernanceAssignments {
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  functionId: string;
  id: string;
  initiatorId?: string | null;
  institutionId?: string | null;
  positionId?: string | null;
  provisionId?: string | null;
  shareTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
