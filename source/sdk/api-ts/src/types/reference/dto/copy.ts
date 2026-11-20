/** One interface or explanatory wording for one copy key in one language, optionally specific to a country. Screens declare keys; the words live here. */
export interface ReferenceCopy {
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  key: string;
  languageId: string;
  text: string;
  updatedAt: string;
  version: number;
}
