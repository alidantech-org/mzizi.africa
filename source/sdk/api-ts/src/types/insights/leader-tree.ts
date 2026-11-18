import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Leader Tree */
export interface InsightsLeaderTree {
  gaps: string[];
  levels: unknown[];
  place?: InsightsPlaceCrumb | null;
}
