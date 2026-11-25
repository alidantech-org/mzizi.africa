import type { AssetKind } from "#/modules/media/schema/enum/asset-kind.enum.ts";
import type { Pixels } from "#/modules/media/schema/type/pixels.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { UseEntryCaptions } from "#/modules/media/schema/interface/use-entry-captions.interface.ts";

/** Use Entry */
export interface UseEntry {
  assetId: Id;
  captions: UseEntryCaptions[];
  embedUrl: Url | null;
  externalUrl: Url | null;
  height: Pixels | null;
  kind: AssetKind;
  kindTerm: Id;
  position: NonNegativeInteger | null;
  purposeTerm: Id;
  s3Key: NonEmptyString1000 | null;
  thumbnailUrl: Url | null;
  width: Pixels | null;
}
