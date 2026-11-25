/** One sitting of a house or committee. */
export interface LegislatureSittings {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  institutionId: string;
  kindTerm: string;
  occurrenceId?: string | null;
  sequence?: number | null;
  session?: string | null;
  termId?: string | null;
  updatedAt: string;
  version: number;
}
