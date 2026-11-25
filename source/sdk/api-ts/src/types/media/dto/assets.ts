import { MediaAssetKind } from "#sdk/types/media/enums/asset-kind.ts";
import { MediaAvailability } from "#sdk/types/media/enums/availability.ts";

/** A photo, logo, flag, video, audio or scan: held bytes or an external link or embed. */
export interface MediaAssets {
  author?: string | null;
  availability?: MediaAvailability | null;
  capturedOn?: string | null;
  checkedAt?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  duration?: number | null;
  embedUrl?: string | null;
  endSecond?: number | null;
  externalId?: string | null;
  externalUrl?: string | null;
  height?: number | null;
  id: string;
  kind: MediaAssetKind;
  kindTerm: string;
  licenceTerm?: string | null;
  providerTerm?: string | null;
  publishedOn?: string | null;
  startSecond?: number | null;
  thumbnailUrl?: string | null;
  updatedAt: string;
  version: number;
  versionId?: string | null;
  width?: number | null;
}
