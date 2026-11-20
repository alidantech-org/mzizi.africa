/** One real human identity; names, identifiers and contacts are normalized in shared tables. */
export interface OfficialIndividuals {
  birthDate?: string | null;
  code: string;
  createdAt: string;
  deathDate?: string | null;
  deletedAt?: string | null;
  id: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
