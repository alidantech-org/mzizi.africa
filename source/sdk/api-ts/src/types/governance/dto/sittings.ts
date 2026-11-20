/** The legislative or deliberative record of one meeting of a public body. When and where it happened is the linked occurrence; this holds the house, term, session and what was considered. */
export interface GovernanceSittings {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  institutionId: string;
  occurrenceId: string;
  sequenceNumber?: number | null;
  sessionLabel?: string | null;
  sittingKindId: string;
  sourceCitationId?: string | null;
  termId?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
