/** The languages a release offers, in order. */
export interface ProductLang {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  position: number;
  releaseId: string;
}
