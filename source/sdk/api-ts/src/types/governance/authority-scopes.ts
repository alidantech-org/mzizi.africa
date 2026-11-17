/** One institution or office authority over a required Geography unit for an effective period. */
export interface GovernanceAuthorityScopes {
  authorityKindId: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  institutionId?: string | null;
  officeId?: string | null;
  sourceCitationId?: string | null;
  unitFeatureId: string;
  updatedAt: string;
  version: number;
}
