import type { InsightsPlaceBrowseMedia } from "#sdk/types/insights/dto/place-browse-media.ts";
import type { InsightsPlaceChild } from "#sdk/types/insights/dto/place-child.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/dto/place-crumb.ts";

/** Place Browse */
export interface InsightsPlaceBrowse {
  chain: InsightsPlaceCrumb[];
  children: InsightsPlaceChild[];
  media: InsightsPlaceBrowseMedia[];
  place?: InsightsPlaceCrumb | null;
}
