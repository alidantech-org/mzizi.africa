/** One person's continuous tenure in one office, with appointment kind and effective dates. */
export interface GovernanceHolders {
  appointedByEntityId?: string | null;
  appointmentKindId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  individualId: string;
  officeId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
