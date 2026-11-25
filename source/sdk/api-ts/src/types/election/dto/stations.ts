/** A polling station in an election. */
export interface ElectionStations {
  closesAt?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  electionId: string;
  featureId: string;
  hostId?: string | null;
  id: string;
  note?: string | null;
  noteLanguageId?: string | null;
  opensAt?: string | null;
  registeredVoters?: number | null;
  statusTerm?: string | null;
  streams?: number | null;
  updatedAt: string;
  version: number;
}
