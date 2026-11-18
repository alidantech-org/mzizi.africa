/** The name of an event in one language; at most one preferred name per event and language. */
export interface EventNames {
  createdAt: string;
  deletedAt?: string | null;
  eventId: string;
  id: string;
  isPreferred: boolean;
  languageId: string;
  name: string;
  updatedAt: string;
  version: number;
}
