import { SharedSubjectTable } from "#sdk/types/enums/shared/subject-table.ts";

/** One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded. */
export interface FilesystemContents {
  body: string;
  categoryId: string;
  classificationId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fileVersionId?: string | null;
  id: string;
  isDevelopmentText: boolean;
  languageId: string;
  subjectId: string;
  subjectTable: SharedSubjectTable;
  summary?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
