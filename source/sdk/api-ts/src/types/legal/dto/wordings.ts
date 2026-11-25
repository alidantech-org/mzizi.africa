/** The official text of a provision in one edition and language. */
export interface LegalWordings {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  editionId: string;
  endsOn?: string | null;
  heading?: string | null;
  id: string;
  languageId: string;
  provisionId: string;
  startsOn?: string | null;
  supersedesId?: string | null;
  text: string;
  updatedAt: string;
  version: number;
}
