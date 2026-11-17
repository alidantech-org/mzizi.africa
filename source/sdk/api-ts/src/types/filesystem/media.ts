/** A logo, symbol, photograph, recording or other media an entity or person can point at; its bytes are a filesystem file version. */
export interface FilesystemMedia {
  altText?: string | null;
  caption?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fileVersionId?: string | null;
  id: string;
  kindId: string;
  sourceUrl?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
