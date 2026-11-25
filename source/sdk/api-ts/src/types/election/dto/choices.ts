/** A referendum choice (yes, no). */
export interface ElectionChoices {
  ballotOrder: number;
  code: string;
  contestId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  text: string;
  updatedAt: string;
  version: number;
}
