/** One dated, typed relationship between two government institutions. */
export interface GovernanceRelationships {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  objectInstitutionId: string;
  relationshipKindId: string;
  sourceCitationId?: string | null;
  subjectInstitutionId: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
