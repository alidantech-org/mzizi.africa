import { MediaTextOrigin } from "#sdk/types/media/enums/text-origin.ts";
import { MediaTextStatus } from "#sdk/types/media/enums/text-status.ts";

/** Article Detail Texts */
export interface MediaArticleDetailTexts {
  body: string;
  languageCode: string;
  origin: MediaTextOrigin;
  status: MediaTextStatus;
  summary: string | null;
  title: string;
}
