import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer. */
export interface FilesystemMedia {
  altText?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  endSecond?: number | null;
  externalUrl?: string | null;
  fileVersionId?: string | null;
  id: string;
  kindId: string;
  platformId?: string | null;
  position?: number | null;
  purpose?: string | null;
  startSecond?: number | null;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  thumbnailUrl?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
