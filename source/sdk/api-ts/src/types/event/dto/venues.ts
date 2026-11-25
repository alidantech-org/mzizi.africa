/** Where an occurrence takes place. */
export interface EventVenues {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  note?: string | null;
  noteLanguageId?: string | null;
  occurrenceId: string;
  roleTerm: string;
  updatedAt: string;
  version: number;
}
