/** One issue of a product. */
export interface SourceEditions {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  designation: string;
  id: string;
  languageId?: string | null;
  productId: string;
  publishedOn?: string | null;
  updatedAt: string;
  version: number;
}
