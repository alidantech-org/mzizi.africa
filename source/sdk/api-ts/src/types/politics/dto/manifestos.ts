/** A party's or candidate's manifesto for an election. */
export interface PoliticsManifestos {
  artifactId?: string | null;
  candidateId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  electionId?: string | null;
  id: string;
  partyId?: string | null;
  publishedOn?: string | null;
  updatedAt: string;
  version: number;
}
