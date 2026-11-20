/** One event or a recurring series of events: a public holiday, a national day, an election, a sitting, a government visit. Names, rules and dated occurrences are separate; content and media attach through the subject mechanism. */
export interface EventEvents {
  basisProvisionId?: string | null;
  calendarId?: string | null;
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  eventKindId: string;
  id: string;
  organiserEntityId?: string | null;
  scopeFeatureId?: string | null;
  scopeLevelKindId?: string | null;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
