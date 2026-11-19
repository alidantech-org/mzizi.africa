import type { InsightsLeaderTreeLevels } from "#sdk/types/insights/leader-tree-levels.ts";
import type { InsightsPlaceCrumb } from "#sdk/types/insights/place-crumb.ts";

/** Leader Tree */
export interface InsightsLeaderTree {
  gaps: string[];
  levels: InsightsLeaderTreeLevels[];
  place?: InsightsPlaceCrumb | null;
}
