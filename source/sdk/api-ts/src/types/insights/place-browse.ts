import type { InsightsPlaceChild } from "#sdk/types/insights/place-child.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Place Browse */
export interface InsightsPlaceBrowse {
  chain: InsightsPlaceCrumb[];
  children: InsightsPlaceChild[];
  media: unknown[];
  place?: InsightsPlaceCrumb | null;
}
