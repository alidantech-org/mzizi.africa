/** A name of one instrument in one language, with its kind and validity. All forms resolve to the same instrument. */
export interface LegalNames {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  instrumentId: string;
  isPreferred: boolean;
  kindId: string;
  languageId: string;
  name: string;
  updatedAt: string;
  version: number;
}
