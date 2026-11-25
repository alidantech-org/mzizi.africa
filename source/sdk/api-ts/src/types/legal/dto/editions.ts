/** One edition of an instrument with its consolidation and commencement dates. */
export interface LegalEditions {
  ceasedOn?: string | null;
  code: string;
  commencedOn?: string | null;
  consolidatedOn?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  designation: string;
  id: string;
  instrumentId: string;
  repealedOn?: string | null;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}
