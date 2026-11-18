/** A fixed period for which offices are filled: a presidential term, a parliament, a county assembly. Elections, by-elections, mandates and sittings belong to a term. */
export interface GovernanceTerms {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  id: string;
  institutionId?: string | null;
  ordinal?: number | null;
  sourceCitationId?: string | null;
  startsOn: string;
  termKindId: string;
  unitFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
