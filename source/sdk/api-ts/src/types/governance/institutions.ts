/** One government institution specialization of an Official entity. */
export interface GovernanceInstitutions {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  entityId: string;
  id: string;
  institutionKindId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
