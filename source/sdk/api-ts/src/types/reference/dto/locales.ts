/** A language in a country (sw-KE, fr-CD) with its dated status. Drives the language fallback chain, the languages a site offers and number formatting. */
export interface ReferenceLocales {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  languageId: string;
  position: number;
  statusTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
