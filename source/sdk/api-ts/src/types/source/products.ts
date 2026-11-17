/** One logical document or dataset, independent of who served it, in what format or how many times it was downloaded. */
export interface SourceProducts {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kindId: string;
  publisherId?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
