import { MediaAssetKind } from "#sdk/types/media/enums/asset-kind.ts";
import type { MediaUseEntryCaptions } from "#sdk/types/media/dto/use-entry-captions.ts";

/** Use Entry */
export interface MediaUseEntry {
  assetId: string;
  captions: MediaUseEntryCaptions[];
  embedUrl: string | null;
  externalUrl: string | null;
  height: number | null;
  kind: MediaAssetKind;
  kindTerm: string;
  position: number | null;
  purposeTerm: string;
  s3Key: string | null;
  thumbnailUrl: string | null;
  width: number | null;
}
