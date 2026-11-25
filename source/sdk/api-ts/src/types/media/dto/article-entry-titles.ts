import { MediaTextOrigin } from "#sdk/types/media/enums/text-origin.ts";
import { MediaTextStatus } from "#sdk/types/media/enums/text-status.ts";

/** Article Entry Titles */
export interface MediaArticleEntryTitles {
  languageCode: string;
  origin: MediaTextOrigin;
  status: MediaTextStatus;
  summary: string | null;
  title: string;
}
