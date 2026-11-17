/** One responsibility or authority assignment for an institution or office. */
export interface GovernanceMandates {
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  id: string;
  institutionId?: string | null;
  mandateKindId: string;
  officeId?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
