/** One contest in an election: one seat or one referendum question for one place. */
export interface ElectionContests {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  electionId: string;
  featureId?: string | null;
  id: string;
  kindTerm: string;
  officeId?: string | null;
  previousHolderId?: string | null;
  reasonTerm?: string | null;
  seatCount?: number | null;
  updatedAt: string;
  version: number;
}
