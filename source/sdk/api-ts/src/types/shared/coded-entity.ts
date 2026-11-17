/** Base for versioned records with a unique identity code. */
export interface SharedCodedEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  updatedAt: string;
  version: number;
}
