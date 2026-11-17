/** One established public office, independent of any current holder and optionally scoped to a geographic unit. */
export interface GovernanceOffices {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  institutionId: string;
  officeKindId: string;
  sourceCitationId?: string | null;
  unitFeatureId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
