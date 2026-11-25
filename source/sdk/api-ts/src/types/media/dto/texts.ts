import { MediaTextOrigin } from "#sdk/types/media/enums/text-origin.ts";
import { MediaTextStatus } from "#sdk/types/media/enums/text-status.ts";

/** One article in one language: exactly one original per article, at most one live text per language. */
export interface MediaTexts {
  articleId: string;
  body: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  languageId: string;
  origin: MediaTextOrigin;
  status: MediaTextStatus;
  summary?: string | null;
  title: string;
  translatedFromId?: string | null;
  updatedAt: string;
  version: number;
}
