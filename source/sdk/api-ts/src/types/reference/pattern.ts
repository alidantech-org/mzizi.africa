/** Stable identity for a reusable, reviewed pattern definition. */
export interface ReferencePattern {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  title: string;
  updatedAt: string;
  version: number;
}
