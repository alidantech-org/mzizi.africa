/** A meaningfully distinct release of a product. Another format or scan of the same wording is an artifact, not an edition. */
export interface SourceEditions {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  designation: string;
  id: string;
  languageId?: string | null;
  productId: string;
  publishedOn?: string | null;
  updatedAt: string;
  version: number;
}
