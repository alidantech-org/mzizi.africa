import { MediaTextOrigin } from "#sdk/types/media/enums/text-origin.ts";

/** Title, description and alt text of an asset in one language. */
export interface MediaCaptions {
  altText?: string | null;
  assetId: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  languageId: string;
  origin: MediaTextOrigin;
  title?: string | null;
  updatedAt: string;
  version: number;
}
