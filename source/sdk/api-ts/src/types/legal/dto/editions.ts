/** A meaningful legal content state of an instrument. Not a download and not a Source publication edition. */
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
  observedAt: string;
  repealedOn?: string | null;
  supersedesId?: string | null;
  updatedAt: string;
  version: number;
}
