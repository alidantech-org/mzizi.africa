import type { PlaceChild } from "#/modules/insights/schema/interface/place-child.interface.ts";
import type { PlaceCrumb } from "#/modules/insights/schema/interface/place-crumb.interface.ts";

/** Place Browse */
export interface PlaceBrowse {
  chain: PlaceCrumb[];
  children: PlaceChild[];
  media: Record<string, unknown>[];
  place?: PlaceCrumb | null;
}
