import type { PlaceBrowseMedia } from "#/modules/insights/schema/interface/place-browse-media.interface.ts";
import type { PlaceChild } from "#/modules/insights/schema/interface/place-child.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Place Browse */
export interface PlaceBrowse {
  chain: PlaceCrumb[];
  children: PlaceChild[];
  media: PlaceBrowseMedia[];
  place?: PlaceCrumb | null;
}
