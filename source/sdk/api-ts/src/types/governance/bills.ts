/** A proposed law from introduction to enactment. Stages record each reading, committee, assent and publication; the enacted law is a legal instrument. */
export interface GovernanceBills {
  billKindId: string;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  institutionId: string;
  instrumentId?: string | null;
  sourceCitationId?: string | null;
  sponsorHolderId?: string | null;
  statusId: string;
  summary?: string | null;
  termId?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
